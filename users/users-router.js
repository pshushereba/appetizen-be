const express = require("express");
const router = express.Router();

const Users = require("./users-model.js");

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: "There was an error retrieving the user from the database.",
      });
    });
});

router.put("/:id", (req, res) => {
  const updatedUser = req.body;

  Users.updateUser(req.params.id, updatedUser)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({ message: "There was an error updating the user" });
    });
});

router.delete("/:id", (req, res) => {
  Users.deleteUser(req.params.id)
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(200).json({ message: "The user was successfully deleted" });
      } else {
        res
          .status(404)
          .json({ message: "A user with that ID could not be found." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
