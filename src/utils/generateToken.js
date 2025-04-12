const jwt = require("jsonwebtoken");

exports.generateToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
