const express = require("express");
const router = express.Router();
const peminjamanController = require("../controllers/peminjamanController");

router.get("/all", peminjamanController.getAll);
router.get("/anggota-aktif/:anggotaId", peminjamanController.getByAnggotaAktif);
router.get("/riwayat/:anggotaId", peminjamanController.getRiwayatByAnggota);
router.get("/denda/:anggotaId", peminjamanController.getTotalDendaByAnggota);
router.get("/total-denda", peminjamanController.getTotalDendaSemuaAnggota);
router.get("/peminjaman/terlambat", peminjamanController.getTerlambat);
router.get(
  "/notifikasi/terlambat",
  peminjamanController.getNotifikasiTerlambat
);

router.get("/laporan/terpopuler", peminjamanController.laporanTerpopuler);

router.post("/create", peminjamanController.create);
router.put("/kembalikan/:id", peminjamanController.kembalikan);

module.exports = router;
