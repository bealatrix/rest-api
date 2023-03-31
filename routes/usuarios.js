const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');


const UsuarioController = require('../controllers/usuarios-controller');

router.delete('/delete', login.obrigatorio, UsuarioController.deletarUsuario);
router.post('/cadastro', UsuarioController.cadastrarUsuario);
router.get('/usuarios', login.obrigatorio, UsuarioController.listarUsuarios);
router.post('/login', UsuarioController.loginUsuario);


module.exports = router;