const express = require("express");
const router = express.Router();
const bukuController = require("../controllers/bukuController");

router.get("/all", bukuController.getAll);
router.get("/detail/:id", bukuController.getById);
router.post("/create", bukuController.create);
router.put("/update/:id", bukuController.update);
router.delete("/delete/:id", bukuController.delete);
router.get("/search", bukuController.search);
module.exports = router;
