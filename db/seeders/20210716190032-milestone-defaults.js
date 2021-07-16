"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "milestone_defaults",
      [
        {
          f: "Focus",
          milestone: "Define Goal, Identity, and Result.",
          personalize:
            "I (system) every day because I (name) am (new identity). My new life allows me to (enables what).",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          f: "Fasting",
          milestone: "Go normally without food for 16-20 hrs.",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          f: "Food",
          milestone: "Eat your favorite food properly.",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          f: "Fitness",
          milestone:
            "Burn the same amount of calories as someone who goes to the gym.",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("milestone_defaults", null, {});
  },
};
