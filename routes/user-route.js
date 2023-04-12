const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');


const UsuarioController = require('../controllers/user-controller');

router.delete('/delete', login.obrigatorio, UsuarioController.deleteUser);
router.post('/create', UsuarioController.createUser);
router.get('/users', login.obrigatorio, UsuarioController.listUsers);
router.post('/login', UsuarioController.login);


module.exports = router;