const emailTemplate = require("./emailTemplate");
const nodemailer = require("nodemailer");
const res = require("express/lib/response");
const asyncHandler = require("express-async-handler");

const mailHandler = {};

/***
 * Details: {
 *
 * username: The username,
 *
 * todo: This tells the user what to do e.g confirm your registered Email
 *
 * mailExplainer: Explains the email e.g You have received this message because your email address has been registered with our site.
 *
 * mailPrompt: Tells the user the next action to take e.g Please click the button below to verify your email address and confirm that you are the owner of this account.
 *
 * url: The actual link of the button e.g CLIENT_URL + "/verify/" + token,
 *
 * buttonText: This is what is the text displayed in the button e.g CONFIRM
 *   subject: This is like todo e.g "Verify Email",
 * }
 */
let count = 0;
mailHandler.sendMessage = asyncHandler(async (mailerData) => {
  const emailUser = process.env.EMAIL_USERNAME;
  const emailPass = process.env.EMAIL_PASSWORD;

  let transporter = await nodemailer.createTransport({
    service: "Yahoo",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const options = {
    from: emailUser,
    to: mailerData.email,
    subject: mailerData.subject,
    html: emailTemplate(mailerData),
  };

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
      count++;

      if (count <= 3) {
        mailHandler.sendMessage(mailerData);
      } else {
        console.log(
          `${mailerData.todo}::: Failed to send mail to ${mailerData.email}`
        );
      }
    } else {
      console.log(info);
    }
  });
});

module.exports = mailHandler;
