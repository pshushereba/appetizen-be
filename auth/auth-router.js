const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  // Pull the user's credentials from the body of the request.
  const user = req.body;

  // Hash the user's password, and set the hashed password as the
  // user's password in the request.
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((newUser) => {
      const token = generateToken(newUser);
      res
        .status(201)
        .json({ created_user: newUser, token: token, user_id: newUser.id });
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error adding a user to the database",
        err,
      });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar_img: user.avatar_img,
          token: token,
          user_id: user.id,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

function generateToken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}

module.exports = router;
