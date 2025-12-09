const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  const token = req.header('x-auth-token') || req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'Sin token, acceso denegado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select('rol');

    if (!user) {
      return res.status(401).json({ msg: 'Token válido pero usuario no encontrado' });
    }

    req.user = { id: payload.id, rol: payload.rol };

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Sin token' });
  if (req.user.rol !== 'admin') return res.status(403).json({ msg: 'Acceso solo admin' });
  next();
};
