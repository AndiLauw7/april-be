const { Anggota } = require("../../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const data = await Anggota.findAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Anggota.findByPk(req.params.id);
      if (!data)
        return res.status(404).json({ message: "Anggota tidak ditemukan" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const data = await Anggota.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const anggota = await Anggota.findByPk(req.params.id);
      if (!anggota)
        return res.status(404).json({ message: "Anggota tidak ditemukan" });

      await anggota.update(req.body);
      res.json(anggota);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const anggota = await Anggota.findByPk(req.params.id);
      if (!anggota)
        return res.status(404).json({ message: "Anggota tidak ditemukan" });

      await anggota.destroy();
      res.json({ message: "Anggota berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
