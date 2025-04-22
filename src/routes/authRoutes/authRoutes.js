const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const bukuController = require("../../controllers/bukuController");
const peminjamanController = require("../../controllers/peminjamanController");
const anggotaController = require("../../controllers/anggotaController");
const {
  verifikasiToken,
} = require("../../middlewares/authMiddleware/authMiddleware");

router.post("/admin/register", authController.registerAdmin);
router.post("/admin/login", authController.loginAdmin);
router.post("/anggota/register", authController.registerAnggota);
router.post("/anggota/login", authController.loginAnggota);
router.post(
  "/admin/addAnggota",
  verifikasiToken,
  authController.adminAddAnggota
);

router.post("/buku/add-buku", bukuController.addBuku);
router.get("/buku/get-buku", bukuController.getAllbuku);
router.get("/buku/get-buku/:id", bukuController.getById);
router.put("/buku/update/:id", bukuController.updateBuku);
router.delete("/buku/hapus-buku/:id", bukuController.deleteBuku);

router.post("/peminjaman/create", peminjamanController.createPeminjaman);
router.get("/peminjaman/get-peminjam", peminjamanController.getAllPeminjam);
router.put(
  "/peminjaman/update-peminjam/:id",
  peminjamanController.updatePeminjam
);

router.get("/anggota/get-all", anggotaController.getAllAnggota);
router.get("/anggota/get-byid/:id", anggotaController.getAnggotaById);
router.put(
  "/anggota/update/:id",
  verifikasiToken,
  anggotaController.updateAnggota
);
router.get(
  "/anggota/profile",
  verifikasiToken,
  anggotaController.getProfileAnggota
);
router.get("/admin/data", verifikasiToken, (req, res) => {
  res.json({ message: "Ini data rahasia admin", user: req.user });
});
router.get("/anggota/data", verifikasiToken, (req, res) => {
  res.json({ message: "Ini data rahasia anggota", user: req.user });
});


module.exports = router;
