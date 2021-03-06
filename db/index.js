"use strict";

const Sequelize = require("sequelize");

// Models
const AccomplishmentModel = require("./models/accomplishment.js");
const BeliefModel = require("./models/belief.js");
const FastingModel = require("./models/fasting.js");
const HabitModel = require("./models/habit.js");
const MilestoneModel = require("./models/milestone.js");
const MilestoneDefaultModel = require("./models/milestoneDefault.js");
const MomentModel = require("./models/moment.js");
const ResourceModel = require("./models/resource.js");
const SkillModel = require("./models/skill.js");
const SleepModel = require("./models/sleep.js");
const PracticeModel = require("./models/practice.js");
const PracticeWeekModel = require("./models/practiceWeek.js");
const PracticeStoreModel = require("./models/practiceStore.js");
const SharedModel = require("./models/shared.js");
const UserModel = require("./models/user.js");

// Database environment config
const env = process.env.NODE_ENV || "development";

let sequelize;

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false, port: 5433 }
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
const Fasting = FastingModel(sequelize, Sequelize);
const Habit = HabitModel(sequelize, Sequelize);
const Milestone = MilestoneModel(sequelize, Sequelize);
const MilestoneDefault = MilestoneDefaultModel(sequelize, Sequelize);
const Moment = MomentModel(sequelize, Sequelize);
const Resource = ResourceModel(sequelize, Sequelize);
const Skill = SkillModel(sequelize, Sequelize);
const Sleep = SleepModel(sequelize, Sequelize);
const PracticeWeek = PracticeWeekModel(sequelize, Sequelize);
const PracticeStore = PracticeStoreModel(sequelize, Sequelize);
const Practice = PracticeModel(sequelize, Sequelize);
const Shared = SharedModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

// Relationships
User.hasMany(Accomplishment);
User.hasMany(Belief);
User.hasMany(Fasting);
User.hasMany(Habit);
User.hasMany(Milestone);
User.hasMany(Moment);
User.hasMany(Skill);
User.hasMany(Sleep);
User.hasMany(Practice);
User.hasMany(PracticeWeek);
User.hasMany(PracticeStore);
User.hasOne(Shared);
PracticeWeek.hasMany(Practice);

Accomplishment.belongsTo(User);
Belief.belongsTo(User);
Fasting.belongsTo(User);
Habit.belongsTo(User);
Milestone.belongsTo(User);
Moment.belongsTo(User);
Skill.belongsTo(User);
Sleep.belongsTo(User);
PracticeWeek.belongsTo(User);
PracticeStore.belongsTo(User);
Practice.belongsTo(User);
Practice.belongsTo(PracticeWeek);
Shared.belongsTo(User);

// Authenticate db and log connection or err
sequelize
  .authenticate()
  .then(() => console.log("~~Database connected~~"))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  Accomplishment,
  Belief,
  Fasting,
  Habit,
  Milestone,
  MilestoneDefault,
  Moment,
  Resource,
  Skill,
  Sleep,
  Practice,
  PracticeWeek,
  PracticeStore,
  User,
  Shared,
};
