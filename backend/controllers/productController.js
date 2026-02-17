const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 8 } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let productsQuery = Product.find(query);

    if (sort === "lowToHigh") {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === "highToLow") {
      productsQuery = productsQuery.sort({ price: -1 });
    }

    // Get total count for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    productsQuery = productsQuery.skip(skip).limit(limitNum);

    const products = await productsQuery;

    console.log(`Sending ${products.length} products (Page ${pageNum}/${Math.ceil(totalProducts / limitNum)}) - Filter: ${JSON.stringify(req.query)}`);

    // Send paginated response with metadata
    res.json({
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
      productsPerPage: limitNum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
