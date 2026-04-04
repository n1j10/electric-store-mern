const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectMongoWithDnsFallback } = require("./utils/mongoConnection");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();
const port = Number(process.env.PORT || 5000);
const INIT_STATE = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed"
};
let appInitPromise;
let initState = INIT_STATE.PENDING;
let lastInitError = null;

function createServerMisconfiguredError(message) {
  const error = new Error(message);
  error.code = "SERVER_MISCONFIGURED";
  return error;
}

function isDatabaseUnavailableError(error) {
  const code = String(error?.code || "").toUpperCase();
  const name = String(error?.name || "");
  const message = String(error?.message || "");

  if (["ECONNREFUSED", "ETIMEOUT", "ENOTFOUND", "EAI_AGAIN", "ECONNRESET"].includes(code)) {
    return true;
  }

  if (/MongooseServerSelectionError|MongoServerSelectionError|MongoNetworkError|MongoTimeoutError/i.test(name)) {
    return true;
  }

  return /querySrv|queryA|getaddrinfo|ENOTFOUND|EAI_AGAIN|server selection timed out|failed to connect|timed out/i.test(
    message
  );
}

function classifyError(error) {
  if (error?.code === "SERVER_MISCONFIGURED") {
    return { status: 500, code: "SERVER_MISCONFIGURED", message: "Unexpected server error." };
  }

  if (isDatabaseUnavailableError(error)) {
    return { status: 503, code: "DATABASE_UNAVAILABLE", message: "Unexpected server error." };
  }

  return { status: 500, code: "INTERNAL_SERVER_ERROR", message: "Unexpected server error." };
}

function logErrorContext(label, error) {
  // eslint-disable-next-line no-console
  console.error(label, {
    name: error?.name,
    code: error?.code,
    message: error?.message
  });
}

async function initializeApp() {
  if (!appInitPromise) {
    initState = INIT_STATE.PENDING;
    appInitPromise = (async () => {
      const mongoUri = process.env.MONGO_URI;

      if (!mongoUri) {
        throw createServerMisconfiguredError("MONGO_URI is missing. Add it to .env.");
      }
      if (!process.env.JWT_SECRET) {
        throw createServerMisconfiguredError("JWT_SECRET is missing. Add it to .env.");
      }

      await connectMongoWithDnsFallback(mongoUri);
      initState = INIT_STATE.SUCCESS;
      lastInitError = null;
      // eslint-disable-next-line no-console
      console.log("MongoDB connected");
    })().catch((error) => {
      initState = INIT_STATE.FAILED;
      lastInitError = error;
      appInitPromise = null;
      logErrorContext("App initialization failed d", error);
      throw error;
    });
  }

  return appInitPromise;
}

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(async (req, res, next) => {
  try {
    await initializeApp();
    return next();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/ready", (req, res) => {
  if (initState !== INIT_STATE.SUCCESS) {
    const fallbackError = lastInitError || new Error("Initialization still in progress.");
    const normalized = classifyError(fallbackError);
    return res.status(normalized.status).json({
      status: "not_ready",
      code: normalized.code,
      message: normalized.message,
      timestamp: new Date().toISOString()
    });
  }

  return res.json({
    status: "ready",
    initState,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, req, res, next) => {
  if (error?.code === "SERVER_MISCONFIGURED" || isDatabaseUnavailableError(error)) {
    const normalized = classifyError(error);
    return res.status(normalized.status).json({
      message: normalized.message,
      code: normalized.code
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "Duplicate resource conflict." });
  }

  logErrorContext("Unhandled request error", error);
  return res.status(500).json({ message: "Unexpected server error.", code: "INTERNAL_SERVER_ERROR" });
});
app.get("/", (req, res) => {
  res.json({ message: "Server is live ..." });
});

function startLocalServer() {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
  });

  initializeApp().catch(() => {
    // Initialization errors are logged in initializeApp and surfaced by readiness routes.
  });
}

if (require.main === module) {
  startLocalServer();
}

module.exports = app;
