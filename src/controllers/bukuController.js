const { Buku } = require("../../models");
const { Op } = require("sequelize");
const bukuController = {
  async getAll(req, res) {
    try {
      const data = await Buku.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getById(req, res) {
    try {
      const data = await Buku.findByPk(req.params.id);
      if (!data)
        return res.status(404).json({ message: "Buku Tidak ditemukan" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    try {
      const newBuku = await Buku.create(req.body);
      res.status(201).json(newBuku);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await Buku.findByPk(req.params.id);
      if (!data)
        return res.status(404).json({ message: "Buku tidak ditemukan" });
      await data.update(req.body);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const data = await Buku.findByPk(req.params.id);
      if (!data)
        return res.status(404).json({ message: "Buku tidak ditemukan" });
      await data.destroy();
      res.json({ message: "Buku berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async search(req, res) {
    try {
      const query = req.query.query || "";
      const data = await Buku.findAll({
        where: {
          title: {
            [Op.like]: `%${query}%`,
          },
        },
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = bukuController;
