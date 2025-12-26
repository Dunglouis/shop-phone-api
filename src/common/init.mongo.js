const mongoose = require("mongoose");
const config = require("config");

module.exports = () => {
  mongoose
    .connect(config.get("db.mongo.uri"))
    .then(() => console.log("Connected!"))
    .catch((err) => console.error("Connection failed:", err));
  return mongoose;
};
