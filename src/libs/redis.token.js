const TokenModel = require("../apps/models/tokenCustomer");
const jwtDecode = require("jwt-decode");
const redisClient = require("../common/init.redis");

exports.addTokenBlackList = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No token found this customer");
    error.statusCode = 404;
    throw error;
  }
  const { accessToken, refreshToken } = token;

  // Add access token to redis blacklist
  const decodeAccessToken = jwtDecode(accessToken);
  if (decodeAccessToken.exp > Date.now() / 1000) {
    await redisClient.set(`tb_${accessToken}`, "revoked", {
      EXAT: decodeAccessToken.exp,
    });
  }

  // Add refresh token to redis blacklist
  const decodeRefreshToken = jwtDecode(refreshToken);
  if (decodeRefreshToken.exp > Date.now() / 1000) {
    await redisClient.set(`tb_${refreshToken}`, "revoked", {
      EXAT: decodeRefreshToken.exp,
    });
  }
};
