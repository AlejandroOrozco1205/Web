console.log(">>> Archivo ROUTE notas.js fue cargado");

const router = require('express').Router();
const { auth } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/notasController');

router.get('/', auth, ctrl.listar);
router.post('/', auth, ctrl.crear);
router.get('/:id', auth, ctrl.ver);
router.put('/:id', auth, ctrl.actualizar);
router.delete('/:id', auth, ctrl.eliminar);

module.exports = router;
