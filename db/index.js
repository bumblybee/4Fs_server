"use strict";

const Sequelize = require("sequelize");

// Models
const AccomplishmentModel = require("./models/accomplishment.js");
const BeliefModel = require("./models/belief.js");
const MilestoneModel = require("./models/milestone.js");
const MomentModel = require("./models/moment.js");
const ResourceModel = require("./models/resource.js");
const SkillModel = require("./models/skill.js");
const SleepModel = require("./models/sleep.js");
const UserModel = require("./models/user.js");

// Database environment config
const env = process.env.NODE_ENV || "development";

let sequelize;

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

const Accomplishment = AccomplishmentModel(sequelize, Sequelize);
const Belief = BeliefModel(sequelize, Sequelize);
const Milestone = MilestoneModel(sequelize, Sequelize);
const Moment = MomentModel(sequelize, Sequelize);
const Resource = ResourceModel(sequelize, Sequelize);
const Skill = SkillModel(sequelize, Sequelize);
const Sleep = SleepModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

// Relationships

// Authenticate db and log connection or err
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  Accomplishment,
  Belief,
  Milestone,
  Moment,
  Resource,
  Skill,
  Sleep,
  User,
};
