const User = require("../models/user");

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.cart || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addToCart = async (req, res) => {
    try {
        const { productId, name, price, image, quantity } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const itemIndex = user.cart.findIndex(item => String(item._id || item.id) === String(productId));

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity = (parseInt(user.cart[itemIndex].quantity) || 0) + (parseInt(quantity) || 1);
        } else {
            user.cart.push({ _id: productId, name, price, image, quantity: parseInt(quantity) || 1 });
        }

        user.markModified("cart");
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => String(item._id || item.id) !== String(req.params.id));

        user.markModified("cart");
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.productStatus = async (req, res) => {
    try {
        res.json({ status: "ok", message: "Product status endpoint" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};