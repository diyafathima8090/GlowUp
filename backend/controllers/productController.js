// const { default: products } = require("razorpay/dist/types/products");
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
  console.log("createProduct: Received data:", req.body);
  console.log("createProduct: Received file:", req.file);
  try {
    const { name, price, description, category, stock } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    const product = await Product.create({
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      image: imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("createProduct Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  console.log("updateProduct: Received data:", req.body);
  console.log("updateProduct: Received file:", req.file);
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("updateProduct Error:", error);
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

exports.getCatogery = async (req,res) =>{
  console.log("9"<"11");
  // console.log("hello")  
  try{
    const result = await Product.aggregate([
      {
        $group:{
          _id:null,
          totalProducts: {
            $sum:{$multiply:["$price","$stock"]}
          },
          totalitem:{
            $sum:"$stock"}
        }
      }
    ]);
    const total = result.length>0 ? result[0].totalProducts:0;

    res.status(200).json({
      success:true,
      totalitem:total,
      totalProducts:result[0]?.totalitem || 0
    });

//     const result = await Product.aggregate([
// {
// $group: {
// _id: null,
// totalPrice: {
// $sum: { $multiply: ["$price", "$stock"] }
// },
// totalStock: { $sum: "$stock" },
// totalCount: { $sum: 1 }
// }
// }
// ]);

// const data = result.length > 0 ? result[0] : {
// totalPrice: 0,
// totalStock: 0,
// totalCount: 0
// };

res.status(200).json({
success: true,
totalPrice: data.totalPrice,
totalStock: data.totalStock,
totalCount: data.totalCount
});
  }
    catch(error){
      res.status(401).json({message:message.error})
    }
  }
