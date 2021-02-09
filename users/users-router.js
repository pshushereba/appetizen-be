const express = require("express");
const router = express.Router();

const Users = require("./users-model.js");

const { nanoid } = require("nanoid");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      const extension = file.mimetype.replace(/image\//g, "");
      cb(null, `photos/appetizen-${nanoid()}.${extension}`);
    },
  }),
});

router.get("/", (req, res) => {
  Users.getAllUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "It didn't work", error: err });
    });
});

router.get("/search/:user", (req, res) => {
  const { query } = req.query;
  Users.searchByUsername(query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "There was an error completing the search." });
    });
});

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

// Add profile picture to user

router.post("/:id/photo", upload.single("photo", 1), (req, res) => {
  const { id } = req.params;
  console.log(req);
  // console.log(req.body);
  const newPhoto = req.file.location;
  console.log("newPhoto", newPhoto);
  Users.updateUserAvatar(id, newPhoto)
    .then((photoLink) => {
      console.log(photoLink);
      res.status(201).json({ photoLink });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

router.post("/:username/subscribe", (req, res) => {
  // const { username } = req.params;
  const subscriber = req.body.subscriber;
  const creator = req.body.creator;

  Users.subscribeToUser(creator, subscriber)
    .then((result) => {
      console.log(result[0]);
      res.status(201).json(result[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err });
    });
});

router.get("/events/:id", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client
  const { id } = req.params;
  let counter = 0;
  let intervalID = setInterval(() => {
    // counter++;
    // if (counter >= 100) {
    //   clearInterval(intervalID);
    //   res.end();
    //   return;
    // }
    const current_subs = Users.countSubscribers(id)
      .then((result) => {
        res.write(`data: ${JSON.stringify({ subscribers: result[0] })}\n\n`);
      })
      .catch((err) => {
        console.error(err);
      });

    // res.write() instead of res.send() to avoid terminating the connection.
  }, 3000);

  // If client closes the connection, stop sending events
  res.on("close", () => {
    console.log("Connection terminated");
    clearInterval(intervalID);
    res.end();
  });
});

module.exports = router;
