const jwt = require("jsonwebtoken");
const config = require("config");
const CustomerModel = require("../models/customer");

exports.verifyAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Refresh token expired",
        });
      }
      return res.status(401).json({
        status: "error",
        message: "Access token is required",
      });
    }
    jwt.verify(token, config.get("app.jwtAccessKey"), async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "Invalid access token",
        });
      }
      const customer = await CustomerModel.findById(decoded.id).select(
        "-password"
      );
      req.customer = customer;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.verifyRefreshToken = (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token is required",
      });
    }
    jwt.verify(token, config.get("app.jwtRefreshKey"), async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            status: "error",
            message: "Refresh token expired",
          });
        }
        return res.status(401).json({
          status: "error",
          message: "Invalid refresh token",
        });
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
