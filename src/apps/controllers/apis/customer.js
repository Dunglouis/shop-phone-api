const CustomerModel = require("../../models/customer");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("../../../libs/jwt");

exports.register = async (req, res) => {
  try {
    // validate from
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validator customer",
        errors: errors.array(),
      });
    }

    //Validate unique email
    const { fullName, email, password, phone, address } = req.body;
    const emailExists = await CustomerModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists!",
      });
    }

    // Validate unique password
    const phoneExists = await CustomerModel.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        status: "error",
        message: "Phone already exists!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create customer
    const newCustomer = await CustomerModel.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      address,
    });
    return res.status(201).json({
      status: "success",
      message: "Register customer successfully!",
      data: newCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = await CustomerModel.findOne({ email });
    if (!isEmail) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email",
      });
    }
    const isPassword = await bcrypt.compare(password, isEmail.password);
    if (!isPassword) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }

    if (isEmail && isPassword) {
      // Generate token
      const accessToken = await jwt.generateAccessToken(isEmail);
      const refreshToken = await jwt.generateRefreshToken(isEmail);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // set true nếu sử dụng https
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const { password, ...others } = isEmail.toObject();
      // return response
      return res.status(200).json({
        status: "success",
        message: "Login successfully!",
        data: others,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.refeshToken = async (req, res) => {
  try {
    const { decoded } = req;
    const accessToken = await jwt.generateAccessToken(decoded);
    return res.status(200).json({
      status: "success",
      message: "Generate access token successfully!",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { customer } = req;
    return res.status(200).json({
      status: "success",
      message: "Get customer info successfully!",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
