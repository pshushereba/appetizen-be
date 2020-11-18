const express = require("express");
const router = express.Router();

const Profiles = require("./profiles-model.js");
const Users = require("../users/users-model.js");

router.post("/", (req, res) => {
  const profile = req.body;

  Profiles.add(profile)
    .then((newProfile) => {
      res.status(201).json(newProfile);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error adding information to your profile.",
      });
    });
});

router.get("/:username", (req, res) => {
  const { username } = req.params;
  Users.findByUsername(username)
    .then((user) => {
      Profiles.findByUserId(user.id)
        .then((profile) => {
          res.status(200).json(profile);
        })
        .catch((err) => {
          res.status(500).json({
            message: "There was an error retrieving your profile information",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not find a profile for that user in the database.",
      });
    });
});

router.put("/:id", (req, res) => {
  const updatedProfile = req.body;

  Profiles.updateProfile(req.params.id, updatedProfile)
    .then((profile) => {
      res.status(201).json(profile);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "There was an error updating your profile", err });
    });
});

module.exports = router;
