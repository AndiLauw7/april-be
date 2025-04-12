const bcrypt = require("bcryptjs");

exports.hasPassword = async (password) => {
  const angkaAcakSalt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, angkaAcakSalt);
};

exports.comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
