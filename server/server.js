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
let appInitPromise;

async function initializeApp() {
  if (!appInitPromise) {
    appInitPromise = (async () => {
      const mongoUri = process.env.MONGO_URI;

      if (!mongoUri) {
        throw new Error("MONGO_URI is missing. Add it to .env.");
      }
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing. Add it to .env.");
      }

      await connectMongoWithDnsFallback(mongoUri);
      // eslint-disable-next-line no-console
      console.log("MongoDB connected");
    })().catch((error) => {
      appInitPromise = null;
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

app.use(async (req, res, next) => {
  try {
    await initializeApp();
    return next();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "Duplicate resource conflict." });
  }
  // eslint-disable-next-line no-console
  console.error(error);
  return res.status(500).json({ message: "Unexpected server error." });
});
app.get("/", (req, res) => {
  res.json({ message: "Server is live ..." });
});

async function startLocalServer() {
  await initializeApp();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startLocalServer().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Startup error:", error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
