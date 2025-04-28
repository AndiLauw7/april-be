const { Admin, Anggota, InviteCode } = require("../../../models");
const { generateToken } = require("../../utils/generateToken");
const { hasPassword, comparePassword } = require("../../utils/hashPassword");

exports.registerAdmin = async (req, res) => {
  try {
    const { nama, email, password, inviteCode } = req.body;

    const validInvite = await InviteCode.findOne({
      where: { code: inviteCode, used: false },
    });
    if (!validInvite) {
      return res
        .status(400)
        .json({ message: "Invite code tidak valid atau sudah dipakai" });
    }

    const hashed = await hasPassword(password);
    const admin = await Admin.create({
      nama,
      email,
      password: hashed,
      inviteCodeId: validInvite.id,
    });
    validInvite.used = true;
    await validInvite.save();
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
    const cekAkun = await Anggota.findOne({ where: { email } });
    if (cekAkun) {
      return res.status(400).json({ message: "Email Sudah terdaftar" });
    }
    const hashed = await hasPassword(password);

    const anggota = await Anggota.create({
      nis,
      nama_siswa,
      email,
      kelas,
      jenis_kelamin,
      password: hashed,
    });

    const token = await generateToken({
      id: anggota.id,
      email: anggota.email,
      role: "anggota",
    });
    res.status(201).json({
      message: "Registrasi Berhasil",
      anggota: {
        id: anggota.id,
        nama_siswa: anggota.nama_siswa,
        email: anggota.email,
        role: "anggota",
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAnggota = async (req, res) => {
  try {
    const { email, password } = req.body;
    const anggota = await Anggota.findOne({ where: { email } });
    if (!anggota) return res.status(404).json({ message: "Anggota not Found" });

    const match = await comparePassword(password, anggota.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = await generateToken({ id: anggota.id, role: "anggota" });
    res.status(201).json({ message: "Login Berhasil", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.adminAddAnggota = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Hanya admin yang bisa menambahkan anggota" });
    }
    const {
      nis,
      nama_siswa,
      kelas,
      jenis_kelamin,
      tgl_lahir,
      email,
      nohp,
      image,
      password,
    } = req.body;
    if (
      !nis ||
      !nama_siswa ||
      !kelas ||
      !jenis_kelamin ||
      !tgl_lahir ||
      !email ||
      !nohp ||
      !password
    ) {
      return res.status(400).json({ message: "Data Tidak lengkap" });
    }
    const cekKeanggotaan = await Anggota.findOne({ where: { email } });
    if (cekKeanggotaan) {
      return res.status(409).json({ message: "Anggota sudah terdaftar" });
    }
    const enkripsiPassword = await hasPassword(password, 10);
    const newAnggota = await Anggota.create({
      nis,
      nama_siswa,
      kelas,
      jenis_kelamin,
      tgl_lahir,
      email,
      nohp,
      image,
      password: enkripsiPassword,
      adminId: req.user.id,
      role: "anggota",
    });
    res.status(201).json({
      message: "Anggota berhasil ditambahkan",
      anggota: newAnggota,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let userAdmin = await Admin.findOne({ where: { email } });
    if (userAdmin) {
      const match = await comparePassword(password, userAdmin.password);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
      const token = await generateToken({ id: userAdmin.id, role: "admin" });
      return res.status(200).json({
        message: "Login Admin Berhasil",
        token,
        role: "admin",
      });
    }
    let userAnggota = await Anggota.findOne({ where: { email } });
    if (userAnggota) {
      const match = await comparePassword(password, userAnggota.password);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = await generateToken({
        id: userAnggota.id,
        role: "anggota",
      });
      return res.status(200).json({
        message: "Login Anggota Berhasil",
        // jk
        token,
        role: "anggota",
      });
    }
    return res.status(404).json({ message: "Email tidak ditemukan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
