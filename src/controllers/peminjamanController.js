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
      include: [
        {
          model: Buku,
          as: "buku",
          attributes: ["judul_buku", "pengarang", "tahun_terbit", "stok"],
        },
        { model: Anggota, attributes: { exclude: ["password"] } },
      ],
      order: [["createdAt", "DESC"]],
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
    // const status =
    //   typeof req.body.status === "object"
    //     ? req.body.status.status
    //     : req.body.status;
    let { status, tanggal_pinjam, tanggal_kembali, anggotaId, bukuId } =
      req.body;
    status =
      typeof req.body.status === "object"
        ? req.body.status.status
        : req.body.status;
    let denda = 0;

    const dataPeminjaman = await Peminjaman.findByPk(id);
    if (!dataPeminjaman) {
      return res.status(404).json({ message: "Data peminjam tidak ditemukan" });
    }

    if (dataPeminjaman.status === "dikembalikan") {
      return res.status(404).json({
        message: "Data tidak bisa diedit karena buku sudah dikembalikan.",
      });
    }

    if (status === "dikembalikan" && dataPeminjaman.status !== "dikembalikan") {
      const hariIni = new Date();

      const tanggalKembali = new Date(dataPeminjaman.tgl_kembali);
      tanggalKembali.setHours(0, 0, 0, 0);

      const selisih = hariIni - tanggalKembali;
      console.log("Selisih milidetik:", selisih);
      const selisihHari = Math.ceil(selisih / (1000 * 60 * 60 * 24));

      if (selisihHari > 0) {
        const dendaPerhari = 1000;
        denda = selisihHari * dendaPerhari;
        console.log("Denda yang dihitung:", denda);
      }

      const dataBuku = await Buku.findByPk(dataPeminjaman.bukuId);
      // await dataBuku.update({ stok: dataBuku.stok + 1 });
      if (dataBuku) {
        await dataBuku.update({ stok: dataBuku.stok + 1 });
      }
    }

    const updateData = {
      status: status || dataPeminjaman.status,
      tgl_pinjam: tanggal_pinjam || dataPeminjaman.tgl_pinjam,
      tgl_kembali: tanggal_kembali || dataPeminjaman.tgl_kembali,
      anggotaId: anggotaId || dataPeminjaman.anggotaId,
      bukuId: bukuId || dataPeminjaman.bukuId,
      denda,
    };

    // await dataPeminjaman.update({ status: status, denda });
    await dataPeminjaman.update(updateData);
    res
      .status(200)
      .json({ message: "Peminjaman diperbarui", data: dataPeminjaman });
  } catch (error) {
    console.error("Update error:", error);

    res.status(500).json({ message: "Gagal update data peminjaman" });
  }
};

exports.getPeminjamanByAnggota = async (req, res) => {
  try {
    const { id } = req.params;
    const peminjaman = await Peminjaman.findAll({
      where: { anggotaId: id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Buku,
          as: "buku",
          attributes: ["id", "judul_buku", "pengarang"],
        },
      ],
    });
    if (!peminjaman.length) {
      return res
        .status(404)
        .json({ message: "Data peminjaman tidak ditemukan" });
    }
    res.json({ peminjaman });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};