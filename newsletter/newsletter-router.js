const express = require("express");
const router = express.Router();
const Mailchimp = require("mailchimp-api-v3");

const mailchimpClient = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

router.post("/", (req, res) => {
  const body = req.body;

  return mailchimpClient
    .request({
      method: "POST",
      path: "/lists/" + audienceId + "/members",
      body: {
        email_address: body.email,
        status: "subscribed",
      },
    })
    .then((result) => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      console.error("newsletter error", error);

      if (error.title === "Member Exists") {
        return res.send({ status: "success" });
      }

      res.send({ status: "error", error: error });
    });
});

module.exports = router;
