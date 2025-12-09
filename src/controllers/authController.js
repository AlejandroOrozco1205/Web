const User = require('../models/User');
console.log("User Schema paths ->", Object.keys(User.schema.paths));
const jwt = require('jsonwebtoken');

function generarToken(user) {
  return jwt.sign(
    { id: user._id.toString(), rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

exports.register = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    const user = await User.create({ nombre, correo, contrasena });
    res.status(201).json({
      message: 'Usuario registrado.',
      token: generarToken(user)
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }
    console.error("ERROR REAL:", err);
    res.status(500).json({ message: 'Error al registrar.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const esValida = await user.compareContrasena(contrasena);
    if (!esValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    res.json({
      message: 'Inicio de sesión exitoso.',
      token: generarToken(user)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};
