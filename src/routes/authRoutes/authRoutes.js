const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const {
  verifikasiToken,
} = require("../../middlewares/authMiddleware/authMiddleware");

router.post("/admin/register", authController.registerAdmin);
router.post("/admin/login", authController.loginAdmin);
router.post("/anggota/register", authController.registerAnggota);
router.post("/anggota/login", authController.loginAnggota);

router.get("/admin/data", verifikasiToken, (req, res) => {
  res.json({ message: "Ini data rahasia admin", user: req.user });
});
module.exports = router;
