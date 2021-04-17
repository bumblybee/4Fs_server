const User = require("../db").User;
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");
const { Milestone } = require("../db");
const {
  generateUserMilestones,
} = require("../utils/milestones/milestonesGenerator");

exports.generateJWT = (user) => {
  const data = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "4h";

  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

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

      const userMilestones = generateUserMilestones(createdUser.id);

      const createdMilestones = await Milestone.bulkCreate(...userMilestones);

      // Pull password out of createdUser before sending
      const userData = {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        age: createdUser.age,
        height: createdUser.height,
        weight: createdUser.weight,
        gender: createdUser.gender,
      };

      return { jwt, userData, createdMilestones };
    } else {
      throw new Error("auth.failedSignup", "SignupError", 401);
    }
  }
};

exports.loginUser = async (user) => {
  const userRecord = await User.findOne({ where: { email: user.email } });

  if (!userRecord) {
    // Handle login failure
    throw new Error("auth.invalidCredentials", "LoginError", 403);
  }

  const correctPassword = await argon2.verify(
    userRecord.password,
    user.password
  );

  // Handle incorrect password
  if (!correctPassword) {
    throw new Error("auth.invalidCredentials", "LoginError", 401);
  }

  const jwt = this.generateJWT(userRecord);

  // Pull password out of user record
  const userData = {
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    email: userRecord.email,
  };

  return {
    jwt,
    userData,
  };
};
