const express = require("express");
const router = express.Router();

const Users = require("./users-model.js");

const nanoId = require("nanoid");
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
      const extension = file.memetype.replace(/image\//g, "");
      cb(null, `/photos/appetizen-${nanoId()}.${extension}`);
    },
  }),
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

//Add profile picture to user

router.post("/:id/photo", upload.single("photo", 1), (req, res) => {
  const { id } = req.params;

  const newPhoto = {
    avatar: req.files[0].key,
  };
  console.log(res);

  //Need to make a call to a model to add the photo to the database.
});

module.exports = router;
