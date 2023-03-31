const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const PedidosController = require('../controllers/pedidos-controller');


//RETORNA TODOS OS PEDIDOS
router.get('/', PedidosController.getPedidos);

//INSERE UM PEDIDO
router.post('/', PedidosController.postPedidos);

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', PedidosController.getUmPedido);

//EXCLUI UM PEDIDOS
router.delete('/', login.obrigatorio, PedidosController.deletePedido);

module.exports = router;