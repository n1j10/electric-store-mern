const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginAdmin({ email, password }) {
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
  if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
    const error = new Error("Admin credentials are not configured.");
    error.statusCode = 500;
    throw error;
  }

  const validPassword = adminPasswordHash
    ? await bcrypt.compare(String(password), adminPasswordHash)
    : String(password) === adminPassword;
  if (String(email).toLowerCase() !== adminEmail || !validPassword) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "8h";
  return { token: jwt.sign({ role: "admin", email: adminEmail }, process.env.JWT_SECRET, { expiresIn }), expiresIn };
}

module.exports = { loginAdmin };
