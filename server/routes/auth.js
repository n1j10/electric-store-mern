const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const incomingEmail = String(email).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
    return res.status(500).json({ message: "Admin credentials are not configured." });
  }

  let validPassword = false;
  if (adminPasswordHash) {
    validPassword = await bcrypt.compare(String(password), adminPasswordHash);
  } else {
    validPassword = String(password) === adminPassword;
  }

  if (incomingEmail !== adminEmail || !validPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "8h";
  const token = jwt.sign(
    { role: "admin", email: adminEmail },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  return res.json({
    token,
    expiresIn
  });
});

module.exports = router;
