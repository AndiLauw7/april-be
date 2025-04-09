const { Sequelize } = require("sequelize");
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
  // kembalikan: async (req, res) => {
  //   try {
  //     const peminjaman = await Peminjaman.findByPk(req.params.id);
  //     if (!peminjaman)
  //       return res
  //         .status(404)
  //         .json({ message: "Data peminjaman tidak ditemukan" });
  //     if (peminjaman.status === "dikembalikan") {
  //       return res
  //         .status(400)
  //         .json({ message: "Buku sudah dikembalikan sebelumnya" });
  //     }

  //     // Update status
  //     peminjaman.status = "dikembalikan";
  //     await peminjaman.save();

  //     // Tambah stok buku kembali
  //     const buku = await Buku.findByPk(peminjaman.bukuId);
  //     if (buku) {
  //       buku.stock += 1;
  //       await buku.save();
  //     }

  //     res.json({ message: "Buku berhasil dikembalikan", data: peminjaman });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // },
  // kembalikan: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     const peminjaman = await Peminjaman.findByPk(id);
  //     if (!peminjaman) {
  //       return res
  //         .status(404)
  //         .json({ message: "Data peminjaman tidak ditemukan" });
  //     }

  //     if (peminjaman.status === "dikembalikan") {
  //       return res
  //         .status(400)
  //         .json({ message: "Buku sudah dikembalikan sebelumnya" });
  //     }

  //     const today = new Date();
  //     const tanggalPinjam = new Date(peminjaman.tanggalPinjam);
  //     const diffTime = today.getTime() - tanggalPinjam.getTime();
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //     // Update status dan tanggal kembali
  //     peminjaman.status = "dikembalikan";
  //     peminjaman.tanggalKembali = today;
  //     await peminjaman.save();

  //     const terlambat = diffDays > 7 ? diffDays - 7 : 0; // Asumsikan batas pinjam = 7 hari

  //     res.json({
  //       message: "Buku berhasil dikembalikan",
  //       keterlambatan: terlambat > 0 ? `${terlambat} hari` : "Tidak terlambat",
  //     });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // },
  kembalikan: async (req, res) => {
    try {
      const { id } = req.params;

      const peminjaman = await Peminjaman.findByPk(id);
      if (!peminjaman) {
        return res
          .status(404)
          .json({ message: "Data peminjaman tidak ditemukan" });
      }

      if (peminjaman.status === "dikembalikan") {
        return res
          .status(400)
          .json({ message: "Buku sudah dikembalikan sebelumnya" });
      }

      const today = new Date();
      const tanggalPinjam = new Date(peminjaman.tanggalPinjam);
      const diffTime = today - tanggalPinjam;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const batasHari = 7;
      const tarifDendaPerHari = 1000;
      const terlambat = diffDays > batasHari ? diffDays - batasHari : 0;
      const denda = terlambat * tarifDendaPerHari;

      peminjaman.status = "dikembalikan";
      peminjaman.tanggalKembali = today;
      peminjaman.denda = denda;
      await peminjaman.save();

      res.json({
        message: "Buku berhasil dikembalikan",
        keterlambatan: terlambat > 0 ? `${terlambat} hari` : "Tidak terlambat",
        denda: terlambat > 0 ? `Rp${denda}` : "Rp0",
      });
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
  getTotalDendaByAnggota: async (req, res) => {
    try {
      const { anggotaId } = req.params;

      const total = await Peminjaman.sum("denda", {
        where: { anggotaId },
      });

      res.json({
        anggotaId,
        totalDenda: `Rp${total || 0}`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getTerlambat: async (req, res) => {
    try {
      const peminjamanTerlambat = await Peminjaman.findAll({
        where: {
          status: "dipinjam",
        },
        include: [
          {
            model: Anggota,
            as: "anggota",
            attributes: ["id", "nama"],
          },
          {
            model: Buku,
            as: "buku",
            attributes: ["id", "title"],
          },
        ],
      });

      const today = new Date();

      const hasil = peminjamanTerlambat
        .filter((p) => {
          const pinjam = new Date(p.tanggalPinjam);
          const selisihHari = Math.ceil(
            (today - pinjam) / (1000 * 60 * 60 * 24)
          );
          return selisihHari > 1;
        })
        .map((p) => {
          const pinjam = new Date(p.tanggalPinjam);
          const selisihHari = Math.ceil(
            (today - pinjam) / (1000 * 60 * 60 * 24)
          );
          return {
            anggota: p.anggota?.nama,
            buku: p.buku?.title,
            tanggalPinjam: pinjam.toISOString().split("T")[0],
            terlambat: `${selisihHari - 7} hari`,
          };
        });

      res.json(hasil);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getTotalDendaSemuaAnggota: async (req, res) => {
    try {
      const { Peminjaman, Anggota } = require("../../models");

      const data = await Peminjaman.findAll({
        attributes: [
          "anggotaId",
          [Sequelize.fn("SUM", Sequelize.col("denda")), "totalDenda"],
        ],
        include: [
          {
            model: Anggota,
            as: "anggota",
            attributes: ["nama"],
          },
        ],
        group: ["anggotaId", "anggota.id"],
      });

      const hasil = data.map((item) => ({
        anggotaId: item.anggotaId,
        nama: item.anggota?.nama,
        totalDenda: Number(item.get("totalDenda")),
      }));

      res.json(hasil);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getNotifikasiTerlambat: async (req, res) => {
    try {
      const batasHari = 1;
      const tarifDendaPerHari = 1000;
      const today = new Date();

      const data = await Peminjaman.findAll({
        where: { status: "dipinjam" },
        include: [
          {
            model: Anggota,
            as: "anggota",
            attributes: ["id", "nama"],
          },
          {
            model: Buku,
            as: "buku",
            attributes: ["title"],
          },
        ],
      });

      const hasil = data
        .map((item) => {
          const tanggalPinjam = new Date(item.tanggalPinjam);
          const diffHari = Math.ceil(
            (today - tanggalPinjam) / (1000 * 60 * 60 * 24)
          );
          if (diffHari > batasHari) {
            const terlambatHari = diffHari - batasHari;
            const denda = terlambatHari * tarifDendaPerHari;
            return {
              anggotaId: item.anggota?.id,
              nama: item.anggota?.nama,
              buku: item.buku?.title,
              tanggalPinjam: tanggalPinjam.toISOString().split("T")[0],
              terlambat: `${diffHari - batasHari} hari`,
              denda: `Rp${denda}`,
            };
          }
          return null;
        })
        .filter(Boolean);

      res.json(hasil);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  laporanTerpopuler: async (req, res) => {
    try {
      const data = await Peminjaman.findAll({
        attributes: [
          "bukuId",
          [Sequelize.fn("COUNT", Sequelize.col("bukuId")), "jumlahDipinjam"],
        ],
        include: [
          {
            model: Buku,
            as: "buku",
            attributes: ["title"],
          },
        ],
        group: ["bukuId", "buku.id"],
        order: [[Sequelize.literal("jumlahDipinjam"), "DESC"]],
      });

      const result = data.map((item) => ({
        judul: item.buku.title,
        jumlahDipinjam: item.get("jumlahDipinjam"),
      }));

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal mengambil data laporan." });
    }
  },
};
