const NodeCache = require("node-cache");
const ProductModel = require("../apps/models/product");
const { performance } = require("perf_hooks");
const redisClient = require("../common/init.redis");
const cache = new NodeCache({
  stdTTL: 10, // Thời gian sống của cache (tính bằng giây)
});

exports.cacheBasic = async (req, res) => {
  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];
  let message;
  let data;

  const cacheProducts = cache.get("products");
  if (cacheProducts) {
    message = "Data from cache";
    data = cacheProducts;
  } else {
    message = "Data from database";
    data = products;
    cache.set("products", data);
  }
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.cacheAdvanced = async (req, res) => {
  let message;
  let data;
  const cacheProducts = cache.get("products");
  if (cacheProducts) {
    message = "Data from cache";
    data = cacheProducts;
  } else {
    message = "Data from database";
    data = await ProductModel.find().limit(100);
    cache.set("products", data);
  }
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

exports.cacheRedis = async (req, res) => {
  let message;
  let data;
  const cacheProducts = await redisClient.json.get("products");
  if (cacheProducts) {
    message = "Data from cache";
    data = cacheProducts;
  } else {
    message = "Data from database";
    data = await ProductModel.find().limit(100);
    await redisClient.json.set("products", "$", data);
    await redisClient.expire("products", 300); // Đặt thời gian sống cho cache là 10 giây
  }
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};
