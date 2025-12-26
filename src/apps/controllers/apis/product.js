const ProductModel = require("../../models/product");
const paginate = require("../../../libs/pagiante");
const fs = require("fs");

exports.findAll = async (req, res) => {
  try {
    const query = {};

    if (req.query.is_featured) query.is_featured = req.query.is_featured;
    if (req.query.category_id) query.category_id = req.query.category_id;
    if (req.query.keyword) query.$text = { $search: req.query.keyword };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const products = await ProductModel.find(query)
      .populate({
        path: "category_id",
      })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    return res.status(200).json({
      status: "success",
      message: "Get products successfully",
      data: products,
      pages: await paginate(page, limit, query, ProductModel),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Get product successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { body, file } = req;
    const product = {
      category_id: body.category_id,
      name: body.name,
      price: body.price,
      status: body.status,
      accessories: body.accessories,
      promotion: body.promotion,
      details: body.details,
      is_stock: body.is_stock,
      is_featured: body.is_featured === "on" || false,
    };
    if (file) {
      const originalname = file.originalname;
      const image = `products/${originalname}`;
      // di chuyển ảnh từ thư mục tạm về thư mục upload/products
      fs.renameSync(file.path, `${__dirname}/../../../public/upload/${image}`);
      product.image = image;
      await ProductModel(product).save();
    }
    return res.status(201).json({
      status: "success",
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, file } = req;

    const product = {
      category_id: body.category_id,
      name: body.name,
      price: body.price,
      status: body.status,
      accessories: body.accessories,
      promotion: body.promotion,
      details: body.details,
      is_stock: body.is_stock,
      is_featured: body.is_featured === "on" || false,
    };

    if (file) {
      const originalname = file.originalname;
      const image = `products/${originalname}`;
      // di chuyển ảnh từ thư mục tạm về thư mục upload/products
      fs.renameSync(file.path, `${__dirname}/../../../public/upload/${image}`);
      product.image = image;
      await ProductModel.updateOne({ _id: id }, { $set: product });
    }
    return res.status(201).json({
      status: "success",
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModel.findByIdAndDelete(id);
    return res.status(201).json({
      status: "success",
      message: "Delete product successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
