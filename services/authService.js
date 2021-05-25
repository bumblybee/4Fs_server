const User = require("../db").User;
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { RESET_PASSWORD_URL } = require("../config/passwordResetConfig");
const { Milestone } = require("../db");
const emailHandler = require("../handlers/emailHandler");
const {
  generateUserMilestones,
} = require("../utils/milestones/milestonesGenerator");
const { CustomError } = require("../handlers/errorHandlers");

exports.generateJWT = (user) => {
  const data = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "5h";

  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

exports.getUser = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: {
      exclude: [
        "password",
        "resetPasswordToken",
        "resetPasswordExpiry",
        "isAdmin",
        "isDeleted",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
  });

  if (user) {
    return user;
  } else {
    throw new CustomError("auth.invalidCredentials", "userError", 401);
  }
};

exports.signupUser = async (user) => {
  const { email, password } = user;
  const existingCredentials = await User.findOne({
    where: { email },
  });

  if (existingCredentials) {
    throw new CustomError("auth.existingCredentials", "SignupError", 401);
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
  const { email, password } = user;

  const userRecord = await User.findOne({ where: { email } });

  if (!userRecord) {
    // Handle login failure
    throw new CustomError("auth.invalidCredentials", "LoginError", 403);
  }

  const correctPassword = await argon2.verify(userRecord.password, password);

  // Handle incorrect password
  if (!correctPassword) {
    throw new Error("auth.invalidCredentials", "LoginError", 401);
  }

  const jwt = this.generateJWT(userRecord);

  // Remove password from user record
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

exports.checkIfUserEmailExists = async (email) => {
  const userRecord = await User.findOne({ where: { email } });

  if (!userRecord) {
    return false;
  } else {
    throw new CustomError("auth.existingCredentials", "SignupError", 401);
  }
};

exports.updateUser = async (id, changes) => {
  const userRecord = await User.findOne({ where: { id } });

  if (!userRecord) {
    // Handle login failure
    throw new CustomError("auth.userNotFound", "userError", 403);
  }

  const record = await User.update(changes, {
    where: { id },
    returning: true,
    plain: true,
  });

  if (!record) {
    throw new Error("auth.userNotFound", "userError", 403);
  }

  const userData = {
    firstName: record[1].firstName,
    lastName: record[1].lastName,
    email: record[1].email,
    weight: record[1].weight,
    height: record[1].height,
    age: record[1].age,
    gender: record[1].gender,
    sheetsURL: record[1].sheetsURL,
  };

  return userData;
};

exports.generatePasswordReset = async (email) => {
  const userRecord = await User.findOne({ where: { email } });

  const resetToken = crypto.randomBytes(25).toString("hex");
  const resetExpiry = Date.now() + 1000 * 60 * 60;

  if (userRecord) {
    await User.update(
      { resetPasswordToken: resetToken, resetPasswordExpiry: resetExpiry },
      { where: { email } }
    );

    const resetPasswordUrl = `${RESET_PASSWORD_URL}/${resetToken}`;

    await emailHandler.sendEmail({
      subject: "Request to Reset your Password",
      filename: "resetPasswordEmail",
      user: { email },
      resetPasswordUrl,
    });
  }

  return { userRecord };
};

exports.passwordReset = async (token, password) => {
  const userRecord = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { [Op.gt]: Date.now() },
    },
  });

  if (userRecord) {
    const hashedPassword = await argon2.hash(password);

    await userRecord.update({ password: hashedPassword });
  } else {
    throw new CustomError("auth.invalidCredentials", "passwordResetError", 401);
  }

  return { userRecord };
};
