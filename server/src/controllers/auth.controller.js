const { loginAdmin } = require("../services/auth.service");

async function login(req, res, next) {
  try {
    res.json(await loginAdmin(req.body || {}));
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
