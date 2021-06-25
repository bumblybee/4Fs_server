const ejs = require("ejs");
const juice = require("juice");
const fs = require("fs");
const path = require("path");
const { CustomError } = require("../handlers/errorHandlers");
const sgMail = require("@sendgrid/mail");

function base64_encode(file) {
  var bitmap = fs.readFileSync(
    path.resolve(__dirname, "../public/assets/" + file),
    { encoding: "base64" }
  );

  return bitmap.toString("base64");
}

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

    // SendGrid requires base64 string for inline images
    const content = base64_encode("4flogo.png");

    const mailOptions = {
      from: "4Fs of Weight Loss <hesstjune@gmail.com>",
      to: options.user.email,
      subject: options.subject,
      html,
      attachments: [
        {
          contentType: "image/png",
          filename: "4flogo.png",
          path: "public/assets/4flogo.png",
          content,
          content_id: "logo",
          disposition: "inline",
        },
      ],
    };

    return sgMail.send(mailOptions);
  } catch (err) {
    console.log(err);
    throw new CustomError(
      "passwordResetEmail.failure",
      "PasswordResetEmailError",
      500
    );
  }
};
