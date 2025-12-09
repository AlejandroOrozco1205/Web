console.log(">>> Archivo ROUTE usuarios.js fue cargado");

const router = require('express').Router();
const { auth, adminOnly } = require('../middlewares/authMiddleware');
const { listarUsuarios, eliminarUsuario } = require('../controllers/usuariosController');

router.get('/', auth, adminOnly, listarUsuarios);
router.delete('/:id', auth, adminOnly, eliminarUsuario);

module.exports = router;
