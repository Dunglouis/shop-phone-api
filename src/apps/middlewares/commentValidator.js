const { body, validationResult } = require("express-validator");

const commentRules = [
  body("name").notEmpty().withMessage("Name is required!"),
  body("email").isEmail().withMessage("Email is required!"),
  body("content").notEmpty().withMessage("Comment content is required!"),
];

const commentValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { commentRules, commentValidator };
