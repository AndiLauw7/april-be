// controller/adminController.js
const { Admin } = require("../../models");

exports.getProfileAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: ["id", "nama", "email", "role"],
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
