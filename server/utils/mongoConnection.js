const dns = require("node:dns");
const mongoose = require("mongoose");

const DEFAULT_MONGO_DNS_SERVERS = "8.8.8.8,1.1.1.1";

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

async function connectMongoWithDnsFallback(mongoUri, options = {}) {
  try {
    await mongoose.connect(mongoUri, options);
    return;
  } catch (error) {
    if (!mongoUri.startsWith("mongodb+srv://") || !isMongoDnsLookupError(error)) {
      throw error;
    }

    const dnsServers = getMongoDnsServers();
    if (!dnsServers.length) {
      throw error;
    }

    dns.setServers(dnsServers);
    // eslint-disable-next-line no-console
    console.warn(
      `MongoDB DNS lookup failed (${error.code || "unknown"}). Retrying with DNS servers: ${dnsServers.join(", ")}`
    );

    await mongoose.connect(mongoUri, options);
  }
}

module.exports = { connectMongoWithDnsFallback };
