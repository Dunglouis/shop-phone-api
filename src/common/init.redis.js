const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: "GhehpWpjUHjbPj5Yvd6K4kZdtLhjdbAW",
  socket: {
    host: "redis-13936.c278.us-east-1-4.ec2.cloud.redislabs.com",
    port: 13936,
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
