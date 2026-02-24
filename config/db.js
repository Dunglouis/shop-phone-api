module.exports = {
  mongo: {
    // uri: process.env.DB_URI || "mongodb://127.0.0.1:27017/vietpro_shop_api",
    uri:
      process.env.DB_URI ||
      "mongodb+srv://adminshopphone:adminshopphone@shopphone.kupxtuz.mongodb.net/vietpro_shop_api?appName=shopphone",
  },

  redis: {
    host:
      process.env.REDIS_HOST ||
      "redis-10935.c83.us-east-1-2.ec2.cloud.redislabs.com",
    port: process.env.REDIS_PORT || 10935,
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || "v4e1dlVfENwOM9r53cZYz57eunYvyP6w",
  },
};
