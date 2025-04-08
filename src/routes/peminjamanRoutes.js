const express = require("express");
const router = express.Router();
const peminjamanController = require("../controllers/peminjamanController");

router.get("/all", peminjamanController.getAll);
router.get("/anggota/:anggotaId", peminjamanController.getByAnggotaAktif);
router.get("/riwayat/:anggotaId", peminjamanController.getRiwayatByAnggota);
router.post("/create", peminjamanController.create);

router.put("/kembalikan/:id", peminjamanController.kembalikan);

module.exports = router;
