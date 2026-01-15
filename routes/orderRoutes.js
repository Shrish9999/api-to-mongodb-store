const express = require('express');
const router = express.Router();
// Import mein getMyOrders add karo 👇
const { addOrderItems, getOrders, updateOrderStatus, deleteOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); 

router.post('/', protect, addOrderItems);
router.get('/', protect, getOrders);

// 👇 Yeh nayi line add karo (Isse 'put' aur 'delete' se upar rakhna)
router.get('/myorders', protect, getMyOrders);

router.put('/:id', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;