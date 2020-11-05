const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Routers and Middleware
const authRouter = require("../auth/auth-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.send("<h1>Appetizen</h1>");
});

module.exports = server;
