const express = require('express');
const {
    addToCart,
    getCartById,
    removeFromCart
} = require('../controller/shoppingCartController');
const {authenticateToken} = require("../security/Auth")

const router = express.Router();

router.post('/save', addToCart);
router.get('/:userId', getCartById);
router.delete('/:userId/:clothId', authenticateToken, removeFromCart);

module.exports = router;