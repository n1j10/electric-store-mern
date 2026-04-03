const dns = require("node:dns");
const mongoose = require("mongoose");

const DEFAULT_MONGO_DNS_SERVERS = "8.8.8.8,1.1.1.1";
const DEFAULT_MONGO_CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000
};

function withMongoTimeouts(options = {}) {
  return { ...DEFAULT_MONGO_CONNECT_OPTIONS, ...options };
}

function getMongoDnsServers() {
  const rawValue = process.env.MONGO_DNS_SERVERS || DEFAULT_MONGO_DNS_SERVERS;
  return rawValue
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
}

function isMongoDnsLookupError(error) {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "");

  if (["ECONNREFUSED", "ETIMEOUT", "ENOTFOUND", "EAI_AGAIN"].includes(code)) {
    return true;
  }

  return /querySrv|queryA|ENOTFOUND|EAI_AGAIN/i.test(message);
}

function enrichMongoError(error, stage) {
  if (error && typeof error === "object") {
    error.mongoStage = stage;
    error.mongoCode = error.code || null;
  }
  return error;
}

async function connectMongoWithDnsFallback(mongoUri, options = {}) {
  const connectOptions = withMongoTimeouts(options);

  try {
    await mongoose.connect(mongoUri, connectOptions);
    return;
  } catch (error) {
    const initialError = enrichMongoError(error, "initial_connect");

    if (!mongoUri.startsWith("mongodb+srv://") || !isMongoDnsLookupError(initialError)) {
      throw initialError;
    }

    const dnsServers = getMongoDnsServers();
    if (!dnsServers.length) {
      throw initialError;
    }

    dns.setServers(dnsServers);
    // eslint-disable-next-line no-console
    console.warn(
      `MongoDB DNS lookup failed (${initialError.code || "unknown"}). Retrying with DNS servers: ${dnsServers.join(
        ", "
      )}`
    );

    try {
      await mongoose.connect(mongoUri, connectOptions);
    } catch (retryError) {
      throw enrichMongoError(retryError, "dns_retry_connect");
    }
  }
}

module.exports = { connectMongoWithDnsFallback };
