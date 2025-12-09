const User = require('../models/User');

exports.listarUsuarios = async (req, res) => {
  try {
    const users = await User.find().select('-contrasena');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al listar usuarios' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
};
