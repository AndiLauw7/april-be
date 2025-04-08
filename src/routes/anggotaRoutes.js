const express = require("express");
const router = express.Router();
const anggotaController = require("../controllers/anggotaController");

router.get("/all", anggotaController.getAll);
router.get("/detail/:id", anggotaController.getById);
router.post("/create", anggotaController.create);
router.put("/update/:id", anggotaController.update);
router.delete("/delete/:id", anggotaController.delete);

module.exports = router;
