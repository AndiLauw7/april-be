const { Admin, Anggota } = require("../../../models");
const { generateToken } = require("../../utils/generateToken");
const { hasPassword, comparePassword } = require("../../utils/hashPassword");

exports.registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const hashed = await hasPassword(password);
    const admin = await Admin.create({ nama, email, password: hashed });
    const token = await generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
    res.status(201).json({
      admin: {
        id: admin.id,
        nama: admin.nama,
        email: admin.email,
        role: admin.role,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not Found" });

    const match = await comparePassword(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid Credentials" });

    const token = await generateToken({ id: admin.id, role: "admin" });

    // res.json({ token });
    res.status(201).json({
      message: "Login succes",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerAnggota = async (req, res) => {
  try {
    const { nis, nama_siswa, email, password, kelas, jenis_kelamin } = req.body;
    const hashed = await hasPassword(password);
    const anggota = await Anggota.create({
      nis,
      nama_siswa,
      email,
      kelas,
      jenis_kelamin,
      password: hashed,
    });
    res.status(201).json(anggota);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAnggota = async (req, res) => {
  try {
    const { email, password } = req.body;
    const anggota = await Anggota.findOne({ where: { email } });
    if (!anggota) return res.status(404).json({ message: "Anggota not Found" });

    const match = await comparePassword(password, anggota.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken({ id: anggota.id, role: "anggota" });
    res.status({ token });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
