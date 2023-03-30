const express = require('express');
const router = express.Router();


const UsuarioController = require('../controllers/usuarios-controller');

router.post('/cadastro', UsuarioController.cadastrarUsuario);
/*router.get('/usuarios', UsuarioController.listarUsuarios);*/
router.post('/login', UsuarioController.loginUsuario);


module.exports = router;