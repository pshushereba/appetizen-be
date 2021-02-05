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

router.get("/events", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  let counter = 0;
  let intervalID = setInterval(() => {
    counter++;
    if (counter >= 10) {
      clearInterval(intervalID);
      res.end();
      return;
    }
    res.write(`data: ${JSON.stringify({ num: counter })}\n\n`); // res.write() instead of res.send() to avoid terminating the connection.
  }, 1000);

  // If client closes the connection, stop sending events
  res.on("close", () => {
    console.log("Connection terminated");
    clearInterval(intervalID);
    res.end();
  });
});

module.exports = router;
