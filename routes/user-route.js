
const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const userController = require('../controllers/user-controller');

router.delete('/delete', login.required, userController.deleteUser);
router.post('/create', userController.postUser);
router.get('/', userController.listUsers);
router.post('/login', userController.login);

module.exports = router;