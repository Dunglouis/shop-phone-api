const { createClient } = require("redis");
const config = require("config");

const client = createClient({
  username: config.get("db.redis.username"),
  password: config.get("db.redis.password"),
  socket: {
    host: config.get("db.redis.host"),
    port: config.get("db.redis.port"),
  },
});

client
  .on("error", (err) => console.log("Redis Client Error", err))
  .on("connect", () => console.log("Redis Connected"));

client.connect();
module.exports = client;

// await client.set("foo", "bar");
// const result = await client.get("foo");
// console.log(result); // >>> bar
