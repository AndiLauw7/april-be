const { Peminjaman, Buku, Anggota } = require("../../models");

exports.createPeminjaman = async (req, res) => {
  try {
    const { anggotaId, bukuId, tgl_pinjam, tgl_kembali } = req.body;
    if (!anggotaId || !bukuId || !tgl_pinjam || !tgl_kembali) {
      return res.status(400).json({ message: "Semua Data Wajib di isi" });
    }
    const buku = await Buku.findByPk(bukuId);
    if (!bukuId || buku.stok <= 0) {
      return res.status(400).json({ message: "Stok buku tidak tersedia" });
    }
    const dataPeminjam = await Peminjaman.create({
      anggotaId,
      bukuId,
      tgl_pinjam,
      tgl_kembali,
      status: "dipinjam",
      denda: 0,
    });
    await buku.update({ stok: buku.stok - 1 });
    res
      .status(201)
      .json({ message: "Peminjaman berhasil", data: dataPeminjam });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getAllPeminjam = async (req, res) => {
  try {
    const dataPeminjman = await Peminjaman.findAll({
      include: [Buku, Anggota],
      order: [["createdAt", "Desc"]],
      exclude: [["password"]],
    });
    res.status(200).json({
      message: "Menampilkan data seluruh peminjam",
      dataPeminjman,
    });
  } catch (error) {
    console.error("Gagal meminjam buku:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat ambil data" });
  }
};

exports.updatePeminjam = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("BODY REQUEST:", req.body);
    const { status } = req.body;
    console.log("status", status);

    const dataPeminjaman = await Peminjaman.findByPk(id);
    if (!dataPeminjaman) {
      return res.status(404).json({ message: "Data peminjam tidak ditemukan" });
    }

    let denda = 0;
    console.log("denda", denda);

    if (status === "dikembalikan" && dataPeminjaman.status !== "dikembalikan") {
      const hariIni = new Date();
      const tanggalKembali = new Date(dataPeminjaman.tgl_kembali);

      const selisih = hariIni - tanggalKembali;
      const selisihHari = Math.ceil(selisih / (1000 * 60 * 60 * 24));
      if (selisihHari > 0) {
        const dendaPerhari = 1000;
        denda = selisihHari * dendaPerhari;
      }

      const dataBuku = await Buku.findByPk(dataPeminjaman.bukuId);
      await dataBuku.update({ stok: dataBuku.stok + 1 });
    }

    await dataPeminjaman.update({ status, denda });
    res
      .status(200)
      .json({ message: "Peminjaman diperbarui", data: dataPeminjaman });
  } catch (error) {
    console.error("Update error:", error);

    res.status(500).json({ message: "Gagal update data peminjaman" });
  }
};
