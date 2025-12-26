const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Bật CORS toàn cục
app.use(cors());

// (tuỳ chọn) nếu bạn muốn giới hạn domain được phép truy cập:
app.use(
  cors({
    origin: "http://localhost:3000", // chỉ cho phép React app gọi
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Các middleware khác nếu có (body-parser, json, ...)
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Import routes sau khi bật CORS
app.use(config.get("app.prefixApiVersion"), require("../routers/web"));

module.exports = app;
