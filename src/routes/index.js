const express = require("express");
const router = express.Router();

const bukuRoutes = require("./bukuRoutes");
const anggotaRoutes = require("./anggotaRoutes");
const peminjamanRoutes = require("./peminjamanRoutes");
router.use("/buku", bukuRoutes);
router.use("/anggota", anggotaRoutes);
router.use("/peminjaman", peminjamanRoutes);

module.exports = router;
