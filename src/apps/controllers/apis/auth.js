const Usermodel = require("../../models/user");
const jwt = require("../../../libs/jwt");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;
    const emailExists = await Usermodel.findOne({ email });
    if (emailExists) {
      return res.status(200).json({
        status: "error",
        message: "Email already exists!",
      });
    }
    const phoneExists = await Usermodel.findOne({ phone });
    if (phoneExists) {
      return res.status(200).json({
        status: "error",
        message: "Phone number already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUsers = await Usermodel.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    return res.status(200).json({
      status: "success",
      message: "User registered successfully",
      data: newUsers,
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = await Usermodel.findOne({ email });
    if (!isEmail) {
      return res.status(200).json({
        status: "error",
        message: "Invalid email",
      });
    }
    const isPassword = await bcrypt.compare(password, isEmail.password);
    if (!isPassword) {
      return res.status(200).json({
        status: "error",
        message: "Invalid password",
      });
    }

    if (isEmail && isPassword) {
      const accessToken = await jwt.generateAccessToken(isEmail);
      const refreshToken = await jwt.generateRefreshToken(isEmail);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password, ...others } = isEmail.toObject();
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: others,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.accessToken = async (req, res) => {
  try {
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.refreshToken = async (req, res) => {
  try {
    const { decoded } = req;
    const accessToken = await jwt.generateAccessToken(decoded);
    return res.status(200).json({
      status: "success",
      message: "Generate access token successfully!",
      accessToken,
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { user } = req;
    return res.status(200).json({
      status: "success",
      message: "Get user info successfully!",
      data: user,
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
