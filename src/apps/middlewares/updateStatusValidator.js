const { body, validationResult } = require("express-validator");

const allowSatus = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];

const updateStatusRules = [
  body("status")
    .isEmpty()
    .withMessage("Status is required")
    .isIn(allowSatus)
    .withMessage("Invalid order status"),
];

const updateStatusValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { updateStatusRules, updateStatusValidator };
