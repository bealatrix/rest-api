const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const orderController = require('../controllers/order-controller');

router.get('/', orderController.getOrders);
router.post('/', login.required, orderController.postOrder);
router.get('/:orderId', orderController.getOrderDetail);
router.delete('/', login.required, orderController.deleteOrder);

module.exports = router;