const nodemailer = require("nodemailer");
const ejs = require("ejs");
const juice = require("juice");
const MailSlurp = require("mailslurp-client").default;

const { CustomError } = require("../handlers/errorHandlers");

// const transport = nodemailer.createTransport({
//   host: process.env.MAILTRAP_HOST,
//   port: process.env.MAILTRAP_PORT,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// });

const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

const generateHTML = async (filename, options) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/email/${filename}.ejs`,
    options
  );
  return juice(html);
};

exports.sendEmail = async (options) => {
  try {
    const html = await generateHTML(options.filename, options);

    const mailOptions = {
      from: "4F's of Weight Loss <hesstjune@gmail.com>",
      to: options.user.email,
      subject: options.subject,
      isHTML: true,
      body: html,
    };
    return mailslurp.sendEmail(mailOptions);
    // return transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
