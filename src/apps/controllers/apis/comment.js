const CommentModel = require("../../models/comment");
const pagiante = require("../../../libs/pagiante");
const profanity = require("../../../libs/profanity");
const fs = require("fs");

exports.findByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    query.product_id = id;
    const sort = { _id: req.query.sort === "true" ? 1 : -1 };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const comments = await CommentModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    return res.status(200).json({
      status: "success",
      message: "Get comments successfully!",
      data: comments,
      page: pagiante(page, limit, query, CommentModel),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: message.error,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, content } = req.body;
    const { file } = req;

    let safeContent = content;

    if (profanity.containsBadWord(content)) {
      safeContent = profanity.sanitize(content);
    }
    const newComment = {
      product_id: id,
      name,
      email,
      content: safeContent,
    };
    if (file) {
      const originalname = file.originalname;
      const image = `comments/${originalname}`;
      // di chuyển ảnh từ thư mục tạm về thư mục upload/comments
      fs.renameSync(file.path, `${__dirname}/../../../public/upload/${image}`);
      newComment.image = image;
      await CommentModel(newComment).save();
    }
    return res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    await CommentModel.updateOne({ _id: id }, { $set: { status: 1 } });
    return res.status(200).json({
      status: "success",
      message: "Approve comment successfully!",
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
    await CommentModel.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "Delete comment successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
