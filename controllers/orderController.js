const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Offer = require('../models/offerModel'); // 👈 Offer Model Import kiya

// @desc    Create new order (Supports Coupon Codes & Product Offers)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    // 👇 'couponCode' receive kar rahe hain frontend se
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Calculate Product Totals (Product level offers)
    let calculatedTotal = 0;
    
    const verifiedOrderItems = await Promise.all(orderItems.map(async (item) => {
        const productFromDb = await Product.findById(item.product).populate('offer');

        if (!productFromDb) {
            throw new Error(`Product not found: ${item.product}`);
        }

        // Safety: Convert to Number
        let dbPrice = Number(productFromDb.price);
        let itemQty = Number(item.quantity);
        if (!itemQty || isNaN(itemQty)) itemQty = 1;

        let finalPrice = dbPrice;

        // Check Product-Specific Offer
        if (productFromDb.offer && productFromDb.offer.discount) {
            const discountValue = Number(productFromDb.offer.discount) || 0; 
            const discountAmount = (dbPrice * discountValue) / 100;
            finalPrice = dbPrice - discountAmount;
        }

        calculatedTotal += finalPrice * itemQty;

        return {
            ...item,
            price: finalPrice,
            quantity: itemQty,
            product: productFromDb._id
        };
    }));

    // 2. 👇 CART COUPON LOGIC START (Global Discount)
    if (couponCode) {
        console.log(`Checking Coupon: ${couponCode}`);
        const coupon = await Offer.findOne({ code: couponCode, isActive: true });

        if (coupon) {
            // Check Expiry
            if (new Date() > coupon.expiryDate) {
                // Agar expire ho gaya toh error mat do, bas ignore karo ya log karo
                console.log("Coupon Expired");
            } else {
                // Discount Apply karo Total par
                const couponDiscountVal = Number(coupon.discount);
                const globalDiscountAmount = (calculatedTotal * couponDiscountVal) / 100;
                calculatedTotal -= globalDiscountAmount;
                console.log(`Coupon Applied! New Total: ${calculatedTotal}`);
            }
        } else {
            console.log("Invalid Coupon Code");
        }
    }
    // ☝️ CART COUPON LOGIC END

    // 3. Final Safety Check
    if (isNaN(calculatedTotal) || calculatedTotal < 0) {
        calculatedTotal = 0;
    }

    // 4. Create Order
    const order = new Order({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotal
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ... Baki ke functions same rahenge ...

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    addOrderItems, 
    getOrders, 
    updateOrderStatus, 
    deleteOrder, 
    getMyOrders 
};