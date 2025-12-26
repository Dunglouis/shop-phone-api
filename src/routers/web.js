const express = require("express");
const router = express.Router();

// Import Controller
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const OrderController = require("../apps/controllers/apis/order");
const CommentController = require("../apps/controllers/apis/comment");
const CustomerController = require("../apps/controllers/apis/customer");
const UserController = require("../apps/controllers/apis/auth");
const AdminController = require("../apps/controllers/apis/orderAdmin");

// Import Middlewares
const uploadMiddlwares = require("../apps/middlewares/upload");
const { registerValidator } = require("../apps/middlewares/customerValidator");
const {
  authRules,
  loginValidator,
} = require("../apps/middlewares/authValidator");
const {
  productRules,
  productValidator,
} = require("../apps/middlewares/productValidator");
const {
  categoryRules,
  categoryValidator,
} = require("../apps/middlewares/categoryValidator");
const {
  commentRules,
  commentValidator,
} = require("../apps/middlewares/commentValidator");
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../apps/middlewares/customerAuth");
const {
  verifyAccessTokenUser,
  verifyRefreshTokenUser,
} = require("../apps/middlewares/userAuth");

const {
  userRules,
  userValidator,
} = require("../apps/middlewares/userValidator");

const {
  orderRules,
  orderValidator,
} = require("../apps/middlewares/orderValidator");
const { verifyCustomer } = require("../apps/middlewares/orderAuth");

const {
  updateStatusRules,
  updateStatusValidator,
} = require("../apps/middlewares/updateStatusValidator");

// api categories
router.get("/categories", CategoryController.findAll);
router.get("/categories/:id", CategoryController.findOne);
router.post(
  "/categories/create",
  categoryRules,
  categoryValidator,
  CategoryController.create
);
router.post(
  "/categories/update/:id",
  categoryRules,
  categoryValidator,
  CategoryController.update
);
router.get("/categories/delete/:id", CategoryController.delete);

// api products
router.get("/products", ProductController.findAll);
router.get("/products/:id", ProductController.findOne);
router.post(
  "/products/create",
  uploadMiddlwares.single("image"),
  productRules,
  productValidator,
  ProductController.create
);
router.patch(
  "/products/update/:id",
  uploadMiddlwares.single("image"),
  productRules,
  productValidator,
  ProductController.update
);
router.get("/products/delete/:id", ProductController.delete);
router.get("/products/:id/comments", CommentController.findByProductId);
router.post(
  "/products/:id/comments",
  uploadMiddlwares.single("image"),
  commentRules,
  commentValidator,
  CommentController.create
);

// api orders
router.post(
  "/customers/orders",
  verifyCustomer,
  orderRules,
  orderValidator,
  OrderController.create
);
router.get(
  "/customers/orders",
  verifyAccessToken,
  OrderController.findByCustomerId
);
router.get("/customers/orders/:id", verifyAccessToken, OrderController.findOne);
router.post(
  "/customers/orders/:id/cancel",
  verifyAccessToken,
  OrderController.cancel
);

//api admin orders
router.get("/admin/orders", verifyAccessToken, AdminController.findAll);
router.get("/admin/orders/:id", verifyAccessToken, AdminController.findOne);
router.patch(
  "/admin/orders/:id",
  verifyAccessToken,
  updateStatusRules,
  updateStatusValidator,
  AdminController.updateSatus
);
router.get(
  "/admin/orders/delete/:id",
  verifyAccessToken,
  AdminController.delete
);

// api comments
router.get("/comments/approve/:id", CommentController.approve);
router.get("/comments/delete/:id", CommentController.delete);

// api user
router.post(
  "/auth/users/register",
  userRules,
  userValidator,
  UserController.register
);
router.post(
  "/auth/users/login",
  authRules,
  loginValidator,
  UserController.login
);
router.post(
  "/auth/users/refresh",
  verifyRefreshTokenUser,
  UserController.refreshToken
);
router.get("/auth/users/me", verifyAccessTokenUser, UserController.getMe);

// api customers Auth
router.post(
  "/auth/customers/register",
  registerValidator,
  CustomerController.register
);
router.post(
  "/auth/customers/login",
  authRules,
  loginValidator,
  CustomerController.login
);
router.post("/auth/customers/logout", CustomerController.logout);
router.post(
  "/auth/customers/refresh",
  verifyRefreshToken,
  CustomerController.refeshToken
);
router.get("/auth/customers/me", verifyAccessToken, CustomerController.getMe);

module.exports = router;
