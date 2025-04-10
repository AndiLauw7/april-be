const express = require("express");
const router = express.Router();

const bukuRoutes = require("./bukuRoutes");
const anggotaRoutes = require("./anggotaRoutes");
const peminjamanRoutes = require("./peminjamanRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/buku", bukuRoutes);
router.use("/anggota", anggotaRoutes);
router.use("/peminjaman", peminjamanRoutes);
router.use("/admin", adminRoutes);
module.exports = router;
