const { Anggota } = require("../../models");
const { hasPassword, comparePassword } = require("../utils/hashPassword");
exports.getAllAnggota = async (req, res) => {
  try {
    const anggota = await Anggota.findAll({
      order: [["createdAt", "Desc"]],
    });
    res.status(200).json({
      message: "Berhasil menampilkan data semua Anggota",
      data: anggota,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data anggota",
      error: error.message,
    });
  }
};

exports.getAnggotaById = async (req, res) => {
  try {
    const id = req.params.id;
    const anggota = await Anggota.findByPk(id);
    if (!anggota)
      return res
        .status(404)
        .json({ message: "Data Anggota tidak ditemukan", data: anggota });
    res
      .status(200)
      .json({ message: "Data Anggota berhasil ditampilkan", data: anggota });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data", error: error.message });
  }
};

exports.updateAnggota = async (req, res) => {
  try {
    const { id } = req.params;

    const anggota = await Anggota.findByPk(id);
    if (!anggota) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    const user = req.user;
    console.log("User ID:", req.user.id); // ID pengguna yang sedang login
    console.log("Anggota ID:", anggota.id); // ID anggota yang ingin diperbarui

    if (user.role === "admin") {
      const { email, password } = req.body;
      if (!email && !password) {
        return res.status(400).json({
          message:
            "Admin hanya bisa update username atau password untuk anggota ini",
        });
      }
      const updateData = {};
      if (email) updateData.email = email;
      if (password) updateData.password = await hasPassword(password);
      await anggota.update(updateData);
      return res
        .status(200)
        .json({ message: "Berhasil update akun", data: anggota });
    } else {
      if (anggota.id !== user.id) {
        return res
          .status(403)
          .json({ message: "Kamu hanya bisa update data pribadi sendiri" });
      }
      const { nama_siswa, nohp, email, image } = req.body;
      await anggota.update({ nama_siswa, nohp, email, image });
      return res
        .status(200)
        .json({ message: "Data pribadi berhasil diupdate", data: anggota });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal update anggota", error: error.message });
  }
};
