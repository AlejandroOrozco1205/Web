const Nota = require('../models/Nota');

exports.listar = async (req, res) => {
  try {
    const { page = 1, limit = 10, q } = req.query;
    const pageNum = Math.max(1, Number(page));
    const lim = Math.max(1, Math.min(100, Number(limit)));

    const filtros = { usuario: req.user.id };
    if (q) {
      filtros.titulo = { $regex: q, $options: 'i' };
    }

    const skip = (pageNum - 1) * lim;

    const [total, notas] = await Promise.all([
      Nota.countDocuments(filtros),
      Nota.find(filtros).sort({ updatedAt: -1 }).skip(skip).limit(lim)
    ]);

    res.json({
      page: pageNum,
      limit: lim,
      total,
      totalPages: Math.ceil(total / lim),
      notas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener notas' });
  }
};

exports.crear = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) return res.status(400).json({ msg: 'Faltan campos' });

    const nota = await Nota.create({ titulo, contenido, usuario: req.user.id });
    res.status(201).json(nota);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear nota' });
  }
};

exports.ver = async (req, res) => {
  try {
    const nota = await Nota.findOne({ _id: req.params.id, usuario: req.user.id });
    if (!nota) return res.status(404).json({ msg: 'Nota no encontrada' });
    res.json(nota);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener nota' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const nota = await Nota.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      { titulo, contenido },
      { new: true }
    );
    if (!nota) return res.status(404).json({ msg: 'Nota no encontrada' });
    res.json(nota);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar nota' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const nota = await Nota.findOneAndDelete({ _id: req.params.id, usuario: req.user.id });
    if (!nota) return res.status(404).json({ msg: 'Nota no encontrada' });
    res.json({ msg: 'Nota eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar nota' });
  }
};
