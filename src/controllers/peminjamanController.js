const { Peminjaman, Anggota, Buku } = require("../../models");

module.exports = {
  // Ambil semua data peminjaman
  getAll: async (req, res) => {
    try {
      const data = await Peminjaman.findAll({
        include: [
          { model: Anggota, attributes: ["nama"] },
          { model: Buku, attributes: ["title"] },
        ],
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tambah peminjaman baru
  create: async (req, res) => {
    try {
      const { anggotaId, bukuId, tanggalPinjam, tanggalKembali } = req.body;

      const existing = await Peminjaman.findOne({
        where: {
          anggotaId,
          bukuId,
          status: "dipinjam",
        },
      });

      if (existing) {
        return res.status(400).json({
          message: "Anggota ini masih meminjam Buku ini dan belum dikembalikan",
        });
      }

      const buku = await Buku.findByPk(bukuId);
      if (!buku)
        return res.status(404).json({ message: "Buku tidak ditemukan" });
      if (buku.stock <= 0)
        return res.status(400).json({ message: "Stok buku habis" });

      // Kurangi stok buku
      buku.stock -= 1;
      await buku.save();

      const peminjaman = await Peminjaman.create({
        anggotaId,
        bukuId,
        tanggalPinjam,
        tanggalKembali,
        status: "dipinjam",
      });

      res.status(201).json(peminjaman);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Kembalikan buku
  kembalikan: async (req, res) => {
    try {
      const peminjaman = await Peminjaman.findByPk(req.params.id);
      if (!peminjaman)
        return res
          .status(404)
          .json({ message: "Data peminjaman tidak ditemukan" });
      if (peminjaman.status === "dikembalikan") {
        return res
          .status(400)
          .json({ message: "Buku sudah dikembalikan sebelumnya" });
      }

      // Update status
      peminjaman.status = "dikembalikan";
      await peminjaman.save();

      // Tambah stok buku kembali
      const buku = await Buku.findByPk(peminjaman.bukuId);
      if (buku) {
        buku.stock += 1;
        await buku.save();
      }

      res.json({ message: "Buku berhasil dikembalikan", data: peminjaman });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getByAnggotaAktif: async (req, res) => {
    try {
      const { anggotaId } = req.params;

      const data = await Peminjaman.findAll({
        where: {
          anggotaId,
          status: "dipinjam",
        },
        include: ["Buku"], // Pastikan relasi sudah diset di model
      });

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getRiwayatByAnggota: async (req, res) => {
    try {
      const { anggotaId } = req.params;

      const riwayat = await Peminjaman.findAll({
        where: { anggotaId },
        include: [
          {
            model: Buku,
            as: "Buku",
            attributes: ["id", "title", "author"],
          },
        ],
        order: [["tanggalPinjam", "DESC"]],
      });

      res.json(riwayat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
