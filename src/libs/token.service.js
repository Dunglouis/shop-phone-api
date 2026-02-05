const TokenModel = require("../apps/models/tokenCustomer");
const { addTokenBlackList } = require("./redis.token");
exports.storeCustomerToken = async (customerId, accessToken, refreshToken) => {
  const token = await TokenModel.findOne({ customerId });
  if (token) {
    this.deleteCustomerToken(customerId);
  }
  await TokenModel({
    customerId,
    accessToken,
    refreshToken,
  }).save();
};
exports.deleteCustomerToken = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No token found this customer");
    error.statusCode = 404;
    throw error;
  }
  // move token to redis
  await addTokenBlackList(customerId);
  // delete token from Database
  await TokenModel.deleteOne({ customerId });
};
