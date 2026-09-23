const path = require("path");

const rootEnvPath = path.resolve(__dirname, "../../../.env");
const serverEnvPath = path.resolve(__dirname, "../../.env");
const shouldOverrideLocalEnv = process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";

require("dotenv").config({ path: rootEnvPath, override: shouldOverrideLocalEnv });
require("dotenv").config({ path: serverEnvPath, override: shouldOverrideLocalEnv });

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET
};
