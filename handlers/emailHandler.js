const nodemailer = require("nodemailer");
const ejs = require("ejs");
const juice = require("juice");
const { CustomError } = require("../handlers/errorHandlers");
const sgMail = require("@sendgrid/mail");

const transport = nodemailer.createTransport({
  service: "SendGrid",
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.API_KEY,
  },
});

const generateHTML = async (filename, options) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/email/${filename}.ejs`,
    options
  );
  return juice(html);
};

exports.sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const html = await generateHTML(options.filename, options);

    const mailOptions = {
      from: "4F's of Weight Loss <hesstjune@gmail.com>",
      to: options.user.email,
      subject: options.subject,
      html,
      attachments: [
        {
          contentType: "image/png",
          filename: "4flogo.png",
          path: "public/assets/4flogo.png",
          content: process.env.SENDGRID_IMAGE_B64,
          cid: "logo",
          disposition: "inline",
          content_id: "logo",
        },
      ],
    };

    return sgMail.send(mailOptions);
  } catch (err) {
    throw new CustomError(
      "passwordResetEmail.failure",
      "PasswordResetEmailError",
      500
    );
  }
};
