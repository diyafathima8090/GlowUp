const User = require("../models/user");
const Product = require("../models/product");

exports.createOrder = async (req, res) => {
    try {
        const { cart, totalPrice, shippingAddress, paymentMethod } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const newOrder = {
            _id: new Date().getTime().toString(),
            cart,
            totalPrice,
            shippingAddress,
            paymentMethod,
            status: "Pending",
            createdAt: new Date()
        };

        user.orders.push(newOrder);
        user.cart = [];
        await user.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.orders || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const order = user.orders.find(o => o._id === orderId);

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
        user.markModified("orders"); 
        await user.save();

        res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

