const { Admin } = require("../../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Anggota } = require("../../models");

module.exports = {
  // Menampilkan semua admin
  async getAllAdmins(req, res) {
    try {
      const admins = await Admin.findAll({
        attributes: ["id", "nama", "email", "createdAt"],
      });
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil data admin", error });
    }
  },

  // Menambahkan admin baru
  async createAdmin(req, res) {
    const { nama, email, password } = req.body;

    try {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await Admin.create({
        nama,
        email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "Admin berhasil ditambahkan", data: newAdmin });
    } catch (error) {
      res.status(500).json({ message: "Gagal membuat admin", error });
    }
  },

  tambahAnggotaOlehAdmin: async (req, res) => {
    try {
      const { nama, alamat, noHp } = req.body;
      const AdminId = 1;
      // req.AdminId;
      // diasumsikan adminId sudah tersedia dari middleware auth nanti

      if (!nama || !alamat || !noHp) {
        return res.status(400).json({ message: "Semua field wajib diisi." });
      }

      const anggotaBaru = await Anggota.create({
        nama,
        alamat,
        noHp,
        AdminId, // simpan siapa yang menambahkan
      });

      res.status(201).json({
        message: "Anggota berhasil ditambahkan oleh admin.",
        data: anggotaBaru,
      });
    } catch (error) {
      console.error("Gagal tambah anggota:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menambahkan anggota." });
    }
  },
  // Login admin
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(404).json({ message: "Admin tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password salah" });
      }

      res.status(200).json({ message: "Login berhasil", data: admin });
    } catch (error) {
      res.status(500).json({ message: "Gagal login", error });
    }
  },
};
