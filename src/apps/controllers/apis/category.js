const CategoryModel = require("../../models/category");

exports.findAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({
      status: "success",
      message: "Get Categories Successfully",
      data: categories,
      pages: {},
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "get category successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await CategoryModel.findOne({ name });
    if (category) {
      return res.status(400).json({
        status: "error",
        message: "Danh mục đã tồn tại!",
      });
    }
    const newCategory = {
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
    };
    await CategoryModel(newCategory).save();
    return res.status(201).json({
      status: "success",
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Title is required!",
      });
    }
    const category = await CategoryModel.findOne({ name });
    if (category) {
      return res.status(400).json({
        status: "error",
        message: "Danh mục đã tồn tại!",
      });
    }
    const newCategory = {
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
    };
    await CategoryModel.updateOne({ _id: id }, { $set: newCategory });
    return res.status(201).json({
      status: "success",
      message: "Update category successfully!",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    return res.status(201).json({
      status: "success",
      message: "Delete category successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
