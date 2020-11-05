const jwt = require("jsonwebtoken");

const secrets = require("../config/secrets.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (req.decodedJwt) {
    // will check for a token that is already authorized.
    next();
  } else if (token && token !== undefined) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedJwt) => {
      if (err) {
        res
          .status(401)
          .json({ message: "There was an error verifying the token." });
      } else {
        req.decodedJwt = decodedJwt;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "There was an error authenticating the user." });
  }
};
