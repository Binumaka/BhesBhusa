const express = require('express');
const {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByUser,
    cancelOrder,
    statusupdate,
    createCheckoutSession,
    stripeWebhook
} = require('../controller/orderController');

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.post('/create', createOrder);
router.patch('/:id', cancelOrder);
router.patch("/:orderId/status", statusupdate);
router.post("/create-stripe",createCheckoutSession);
router.post('/webhook', stripeWebhook);
module.exports = router;