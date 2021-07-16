"use strict";
const { MilestoneDefault } = require("../index.js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await MilestoneDefault.sync();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("milestone_defaults");
  },
};
