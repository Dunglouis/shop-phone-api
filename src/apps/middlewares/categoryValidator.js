const { body, validationResult } = require("express-validator");
const categoryRules = [
  body("name").notEmpty().withMessage("Name is required").isString(),
];

const categoryValidator = (req, res, next) => {
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

module.exports = { categoryRules, categoryValidator };
