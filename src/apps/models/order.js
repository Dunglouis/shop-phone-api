const mongoose = require("../../common/init.mongo")();

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Types.ObjectId,
      ref: "Customers",
      default: null,
    },
    fullName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    items: [
      {
        prd_id: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Orders", orderSchema, "orders");
module.exports = OrderModel;
