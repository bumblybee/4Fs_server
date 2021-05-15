let resetPasswordUrl;

if (process.env.NODE_ENV === "development") {
  resetPasswordUrl = "http://localhost:3000/reset-password";
} else {
  resetPasswordUrl = "https://4fsmemberportal.herokuapp.com";
}

exports.RESET_PASSWORD_URL = resetPasswordUrl;
