const express = require("express");
const router = express.Router();

const Accounts = require("./accounts-model.js");
const Users = require("../users/users-model.js");

router.post("/", (req, res) => {
  const account = req.body;

  Accounts.add(account)
    .then((newAccount) => {
      res.status(201).json(newAccount);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error adding information to your account",
      });
    });
});

router.get("/:username", (req, res) => {
  const { username } = req.params;
  Users.findByUsername(username)
    .then((user) => {
      Accounts.findByUserId(user.id)
        .then((acct) => {
          res.status(200).json(acct);
        })
        .catch((err) => {
          res.status(500).json({
            message: "There was an error retrieving your account information",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not find a user with that username in the database",
      });
    });
});

router.put("/:id", (req, res) => {
  const updatedAccount = req.body;

  Accounts.updateAccount(req.params.id, updatedAccount)
    .then((acct) => {
      res.status(201).json(acct);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "There was an error updating your account." });
    });
});

// router.delete("/" (req, res) => {
//   // For deleting the entire record. Will be for admin
// })

module.exports = router;
