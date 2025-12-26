const app = require("../apps/app");
const config = require("config");

const server = app.listen(config.get("app.serverPort"), () => {
  console.log(`Server is running on port ${config.get("app.serverPort")}`);
});
