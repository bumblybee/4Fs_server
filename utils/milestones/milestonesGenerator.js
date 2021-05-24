const milestones = [
  {
    f: "Focus",
    milestone: "Define Goal, Identity, and Result.",
    personalize:
      "I (system) every day because I (name) am (new identity). My new life allows me to (enables what).",
  },
  {
    f: "Fasting",
    milestone: "Go normally without food for 16-20 hrs.",
  },
  {
    f: "Food",
    milestone: "Eat your favorite food properly.",
  },
  {
    f: "Fitness",
    milestone:
      "Burn the same amount of calories as someone who goes to the gym.",
  },
];

exports.generateUserMilestones = function (id) {
  return milestones.map((item) => {
    item["userId"] = id;
    return milestones;
  });
};
