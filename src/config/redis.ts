import { createClient } from "redis";

const redisClient = createClient({
  password: "Uj2oMZsXk3EchhmYUm5t2LHlUuP8oR5p",
  socket: {
    host: "redis-15297.c274.us-east-1-3.ec2.cloud.redislabs.com",
    port: 15297,
  },
});

export default redisClient;
