const { body, validationResult } = require("express-validator");

const productRules = [
  body("name").notEmpty().withMessage("Product name is required!"),
  body("price").notEmpty().withMessage("Price is required!"),
  body("status").notEmpty().withMessage("Status is required!"),
  body("accessories")
    .notEmpty()
    .withMessage("Accessories information is required!"),
  body("promotion").notEmpty().withMessage("Promotion details are required!"),
  body("details").notEmpty().withMessage("Product details are required!"),
];

const productValidator = (req, res, next) => {
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

module.exports = { productRules, productValidator };
