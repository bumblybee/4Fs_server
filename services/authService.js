const User = require("../db").User;
const roles = require("../enums/roles");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");

exports.generateJWT = (user) => {
  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "4h";

  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

// exports.getUser = async (id) => {
//   const user = await User.findOne({
//     where: { id },
//     attributes: ["id", "first_name", "last_name", "email", "isAdmin"],
//     include: [

//     ],
//   });

//   if (user) {
//     return user;
//   } else {
//     return { user: null };
//   }
// };

// exports.createAdminUser = async (username, email, password) => {
//   const hash = await argon2.hash(password);

//   const newAdmin = {
//     first_name,
//     email,
//     password: hash,
//     role: roles.Admin,
//   };

//   const adminUser = await User.create(newAdmin);

//   const createdAdminUser = {
//     id: adminUser.id,
//     username: adminUser.username,
//     email: adminUser.email,
//     isAdmin: true,
//   };

//   return createdAdminUser;
// };

//TODO: pass user object from controller
exports.signupUser = async (user) => {
  const { email, password } = user;
  const existingCredentials = await User.findOne({
    where: { email },
  });

  if (existingCredentials) {
    throw new Error("auth.existingCredentials", "SignupError", 401);
  } else {
    const hash = await argon2.hash(password);

    const newUser = {
      ...user,
      password: hash,
    };

    // Store user in db
    const createdUser = await User.create(newUser);

    if (createdUser) {
      const jwt = this.generateJWT(createdUser);

      // Pull password out of createdUser before sending
      const { password, ...userData } = createdUser;

      return { jwt, userData };
    } else {
      throw new Error("auth.failedSignup", "SignupError", 401);
    }
  }
};

exports.loginUser = async (email, password) => {
  const userRecord = await User.findOne({ where: { email: email } });

  if (!userRecord) {
    // Handle login failure
    throw new Error("auth.invalidCredentials", "LoginError", 403);
  }

  const correctPassword = await argon2.verify(userRecord.password, password);

  // Handle incorrect password
  if (!correctPassword) {
    throw new Error("auth.invalidCredentials", "LoginError", 401);
  }

  const jwt = this.generateJWT(userRecord);

  // Pull password out of user record
  const { password, ...userData } = userRecord;

  return {
    jwt,
    userData,
  };
};
