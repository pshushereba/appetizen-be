require("dotenv").config();
//require("raygun-apm/http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Routers and Middleware
const authRouter = require("../auth/auth-router.js");
const accountRouter = require("../accounts/accounts-router.js");
const profileRouter = require("../profiles/profiles-router.js");
const userRouter = require("../users/users-router.js");
const newsletterRouter = require("../newsletter/newsletter-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/api/auth", authRouter);
//server.use("/api/accounts", accountRouter);
//server.use("/api/profiles", profileRouter);
server.use("/api/users", userRouter);
server.use("/api/newsletter", newsletterRouter);

server.get("/", (req, res) => {
  res.send("<h1>Appetizen</h1>");
});

module.exports = server;
