const User = require("../db").User;
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { logger, loggingFormatter } = require("../handlers/logger");
const { Milestone } = require("../db");
const { Shared } = require("../db");
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
    include: { model: Shared },
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
    throw new CustomError("user.unauthorized", "userError", 401);
  }
};

exports.signupUser = async (user) => {
  const { firstName, lastName, email, password } = user;
  const existingCredentials = await User.findOne({
    where: { email },
  });

  if (existingCredentials) {
    logger.warn(
      `Signup Failure: User record already exists - user id: ${existingCredentials.id}, name: ${existingCredentials.firstName} ${existingCredentials.lastName}, email: ${existingCredentials.email}`
    );

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

      // Create Shared record for user
      Shared.create({ userId: createdUser.id });

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

      logger.info(
        `New User Sign Up - user id: ${createdUser.id}, name: ${createdUser.firstName} ${createdUser.lastName}, email: ${createdUser.email}, admin: ${createdUser.isAdmin}`
      );

      return { jwt, userData, createdMilestones };
    } else {
      logger.error(
        `User Sign Up Failed - name: ${firstName} ${lastName}, email: ${email}`
      );

      throw new CustomError("auth.failedSignup", "SignupError", 401);
    }
  }
};

exports.loginUser = async (user) => {
  const { email, password } = user;

  const userRecord = await User.findOne({ where: { email } });

  if (!userRecord) {
    // Handle login failure
    logger.warn(`User Login Failed: No User Record - email: ${email}`);

    throw new CustomError("auth.invalidCredentials", "LoginError", 401);
  }

  const correctPassword = await argon2.verify(userRecord.password, password);

  // Handle incorrect password
  if (!correctPassword) {
    logger.error(
      `User Login Failed: Incorrect Password - user id: ${userRecord.id}, name: ${userRecord.firstName} ${userRecord.lastName}, email: ${userRecord.email}, admin: ${userRecord.isAdmin}}`
    );

    throw new CustomError("auth.invalidCredentials", "LoginError", 401);
  }

  const jwt = this.generateJWT(userRecord);

  // Remove password from user record
  const userData = {
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    email: userRecord.email,
  };

  logger.info(
    `User Log In - user id: ${userRecord.id}, name: ${userRecord.firstName} ${userRecord.lastName}, email: ${userRecord.email}, admin: ${userRecord.isAdmin}`
  );

  return {
    jwt,
    userData,
  };
};

exports.checkIfUserEmailExists = async (email) => {
  const userRecord = await User.findOne({ where: { email } });

  if (!userRecord) {
    logger.info(`User Signup: Email Available: email: ${email}`);

    return false;
  } else {
    logger.warn(
      `User Email Already Exists - user id: ${userRecord.id}, name: ${userRecord.firstName} ${userRecord.lastName}, email: ${userRecord.email}`
    );

    throw new CustomError("auth.existingEmail", "SignupError", 409);
  }
};

exports.updateUser = async (id, data) => {
  logger.info(loggingFormatter("User Update initiated", data));

  const userRecord = await User.findOne({ where: { id } });

  if (!userRecord) {
    // Handle login failure
    logger.warn(loggingFormatter("User Update Failed: No user record", data));

    throw new CustomError("auth.userNotFound", "userError", 403);
  }

  // If email already in use, return error
  if (data.email && data.email !== userRecord.email) {
    const existingEmail = await User.findOne({ where: { email: data.email } });

    if (existingEmail) {
      logger.warn(
        loggingFormatter("User Update Failed: Email already in system", data)
      );

      throw new CustomError("auth.existingEmail", "UserUpdateError", 409);
    }
  }

  const record = await User.update(data, {
    where: { id },
    returning: true,
    plain: true,
  });

  if (!record) {
    logger.error(loggingFormatter("User Update Failed", data));

    throw new Error("auth.userNotFound", "userError", 403);
  }

  logger.info(loggingFormatter("User Record Updated", data));

  const userData = {
    firstName: record[1].firstName,
    lastName: record[1].lastName,
    email: record[1].email,
    weight: record[1].weight,
    height: record[1].height,
    age: record[1].age,
    phone: record[1].phone,
    gender: record[1].gender,
    sheetsURL: record[1].sheetsURL,
  };

  return userData;
};

exports.generatePasswordReset = async (email) => {
  logger.info(`Password reset request initiated for ${email}`);

  const userRecord = await User.findOne({ where: { email } });

  const resetToken = crypto.randomBytes(25).toString("hex");
  const resetExpiry = Date.now() + 1000 * 60 * 60;

  if (!userRecord)
    logger.warn(`Password Reset Rejected. No record for ${email}`);

  if (userRecord) {
    await User.update(
      { resetPasswordToken: resetToken, resetPasswordExpiry: resetExpiry },
      { where: { email } }
    );

    logger.info(
      `Password Reset Request - user id: ${userRecord.id}, name: ${userRecord.firstName} ${userRecord.lastName}, email: ${userRecord.email}, admin: ${userRecord.isAdmin}`
    );

    const resetPasswordUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

    await emailHandler.sendEmail({
      subject: "Request to Reset your Password",
      filename: "resetPasswordEmail",
      user: { email },
      resetPasswordUrl,
    });

    logger.info(`Password reset email sent to ${email}`);
  }

  return { userRecord };
};

exports.passwordReset = async (token, password) => {
  logger.info("Password Reset Initiated");

  const userRecord = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { [Op.gt]: Date.now() },
    },
  });

  if (userRecord) {
    const hashedPassword = await argon2.hash(password);

    await userRecord.update({ password: hashedPassword });

    const jwt = this.generateJWT(userRecord);

    logger.info(
      `Password Reset Successful - user id ${userRecord.id}, name: ${userRecord.firstName} ${userRecord.lastName} email: ${userRecord.email}`
    );

    return { jwt, userRecord };
  } else {
    logger.error("PasswordReset Failed - no matching token");

    throw new CustomError("auth.noToken", "PasswordResetError", 401);
  }
};
