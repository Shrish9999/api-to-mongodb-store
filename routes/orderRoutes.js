const express = require('express');
const router = express.Router();
// 'deleteOrder' import kiya 👇
const { addOrderItems, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); 

router.post('/', protect, addOrderItems);
router.get('/', protect, getOrders);
router.put('/:id', protect, updateOrderStatus);

// 👇 NEW DELETE ROUTE
router.delete('/:id', protect, deleteOrder);

module.exports = router;