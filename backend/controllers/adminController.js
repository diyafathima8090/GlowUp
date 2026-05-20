const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getDashboardStats = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        const products = await Product.find({});

        const orders = await Order.find({});

        let totalOrders = orders.length;
        const orderStatusMap = { Delivered: 0, Pending: 0, Shipped: 0, Processing: 0, Cancelled: 0 };
        const salesByProduct = {};

        orders.forEach((order) => {
            const status = order.status || "Pending";
            orderStatusMap[status] = (orderStatusMap[status] || 0) + 1;
            if (status !== "Cancelled" && order.items) {
                order.items.forEach((item) => {
                    const revenue = Number(item.price || 0) * Number(item.quantity || item.qty || 1);
                    const itemId = String(item._id || item.id || item.productId);
                    salesByProduct[itemId] = (salesByProduct[itemId] || 0) + revenue;
                });
            }
        });
        // Sales by category
        const categoryMap = {};
        let totalRevenue = 0;
        products.forEach((product) => {
            const productId = String(product._id);
            const revenue = salesByProduct[productId] || 0;
            if (revenue > 0) {
                const category = product.category || "Uncategorized";
                categoryMap[category] = (categoryMap[category] || 0) + revenue;
                totalRevenue += revenue;
            }
        });
        const salesData = Object.keys(categoryMap).map((category) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            revenue: categoryMap[category],
        }));

        const orderStateData = Object.keys(orderStatusMap)
            .filter((key) => orderStatusMap[key] > 0)
            .map((key) => ({ name: key, value: orderStatusMap[key] }));

        const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
        res.json({
            usersCount: users.length,
            productsCount: products.length,
            ordersCount: totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            avgOrder: Number(avgOrder),
            salesData,
            orderStateData,
        });
    } catch (error) {
         console.error("getDashboardStats error:", error)
        res.status(500).json({ message: error.message })
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let matchQuery = {};

        if (search) {
            matchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        const users = await User.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "user",
                    as: "userOrders"
                }
            },
            {
                $addFields: {
                    orderCount: { $size: "$userOrders" }
                }
            },
            {
                $project: {
                    password: 0,
                    userOrders: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.json(users);
    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("getAllOrders error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, sort, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = {};

        if (category && category !== "All") {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        let productsQuery = Product.find(query);

        // Sorting
        if (sort === "asc") {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === "desc") {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        // Total count for pagination metadata
        const totalItems = await Product.countDocuments(query);

        // Apply Pagination
        const products = await productsQuery.skip(skip).limit(parseInt(limit));

        res.json({
            products,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

