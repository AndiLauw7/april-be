const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// GET semua admin
router.get("/", adminController.getAllAdmins);

// POST buat admin baru
router.post("/create", adminController.createAdmin);

// POST login admin
router.post("/login", adminController.login);
router.post("/anggota/create", adminController.tambahAnggotaOlehAdmin);

module.exports = router;
