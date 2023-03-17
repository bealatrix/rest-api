const express = require('express');
const router = express.Router();


const PedidosController = require('../controllers/pedidos-controller');


//RETORNA TODOS OS PEDIDOS
router.get('/', PedidosController.getPedidos);

//INSERE UM PEDIDO
router.post('/:id_pedido', PedidosController.postPedidos);

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', PedidosController.getUmPedido);

//EXCLUI UM PEDIDOS
router.delete('/', PedidosController.deletePedido);

module.exports = router;