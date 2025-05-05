// controller/adminController.js
const { Admin } = require("../../models");
const { hasPassword } = require("../utils/hashPassword");

exports.getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.findAll({
      attributes: ["id", "nama", "email", "role"],
    });
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // if (parseInt(id) === req.user.id) {
    //   return res.status(400).json({
    //     message: "Anda tidak dapat menghapus akun Anda sendiri",
    //   });
    // }
    const { nama, email, password, role } = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }
    let updateFields = { nama, email, role };
    if (password) {
      const hashedPassword = await hasPassword(password);
      updateFields.password = hashedPassword;
    }
    await admin.update(updateFields);
    res.status(200).json({ message: "Admin berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        message: "Anda tidak dapat menghapus akun Anda sendiri",
      });
    }
    const admin = await Admin.findByPk(id);
    await admin.destroy();
    res.status(200).json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};