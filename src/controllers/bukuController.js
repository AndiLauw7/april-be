const { Buku } = require("../../models");

exports.addBuku = async (req, res) => {
  try {
    const { judul_buku, pengarang, tahun_terbit, stok } = req.body;
    if (!judul_buku || !pengarang || !tahun_terbit || stok == null) {
      return res.status(400).json({ message: "Semua data wajib di isi" });
    }
    const cekJudul = await Buku.findOne({ where: { judul_buku } });
    if (cekJudul) {
      return res.status(409).json({ message: "judul buku sudah ada" });
    }

    if (judul_buku.length < 3) {
      return res.status(400).json({ message: "Judul buku minimal 3 karakter" });
    }
    if (!/^\d{4}$/.test(tahun_terbit)) {
      return res
        .status(400)
        .json({ message: "Tahun terbit harus 4 digit angka" });
    }
    const stokAngka = parseInt(stok);

    if (isNaN(stokAngka) || stokAngka < 0) {
      return res
        .status(400)
        .json({ message: "Stock harus berupa angka minimal 0" });
    }
    const bukuBaru = await Buku.create({
      judul_buku,
      pengarang,
      tahun_terbit,
      stok: stokAngka,
    });
    res.status(201).json({
      message: "Buku berhasil ditambahkan",
      buku: bukuBaru,
    });
  } catch (error) {
    console.error("Gagal menambahkan buku:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getAllbuku = async (req, res) => {
  try {
    const buku = await Buku.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({
      message: "Menampilkan semua data Buku",
      buku,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat menampilkan semua data Buku",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await Buku.findByPk(id);
    if (!buku) {
      return res
        .status(404)
        .json({ message: `Buku tidak ditemukan untuk Id ${id}` });
    }
    res.status(200).json({
      message: `Succes menampilkan data buku dengan Id ${id}`,
      buku,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.updateBuku = async (req, res) => {
  try {
    const id = req.params.id;
    const { judul_buku, pengarang, tahun_terbit, stok } = req.body;
    if (!judul_buku || !pengarang || !tahun_terbit || !stok == null) {
      return res.status(400).json({ message: "Data Tidak lengkap" });
    }
    const buku = await Buku.findByPk(id);
    if (!buku) {
      return res.status(404).status({
        message: "Buku Tidak ditemukan",
      });
    }
    await buku.update({
      judul_buku,
      pengarang,
      tahun_terbit,
      stok,
    });
    res.status(200).json({ message: "Data berhasil diperbaharui", buku });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deleteBuku = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await Buku.findByPk(id);
    if (!buku) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    await buku.destroy();
    res.status(200).json({ message: `buku berhasil dengan Id ${id} dihapus ` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
