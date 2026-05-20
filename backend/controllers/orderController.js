const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

exports.createOrder = async (req, res) => {
    try {
        const { cart, totalPrice, shippingAddress, paymentMethod } = req.body;
        
        const order = new Order({
            user: req.user._id,
            items: cart,
            totalPrice: totalPrice,
            shippingAddress,
            paymentMethod,
            status: "Pending"
        });

        await order.save();

        const user = await User.findById(req.user._id);
        if (user) {
            user.cart = [];
            // Assuming pushing to user.orders is no longer needed, otherwise we would do user.orders.push(order._id)
            await user.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Shipped" || order.status === "Delivered") {
            return res.status(400).json({ message: "Cannot cancel shipped or delivered orders" });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        order.status = "Cancelled";
        await order.save();

        res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
