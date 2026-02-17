const User = require("../models/user");

// GET WISHLIST
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.wishlist || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TOGGLE WISHLIST
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId, name, price, image } = req.body;
        const user = await User.findById(req.user._id);

        const exists = user.wishlist.find(item => item._id.toString() === productId);

        if (exists) {
            user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
        } else {
            user.wishlist.push({ _id: productId, name, price, image });
        }

        user.markModified("wishlist");
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
