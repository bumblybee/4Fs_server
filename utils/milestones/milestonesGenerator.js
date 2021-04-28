const milestones = [
  {
    milestone: "Define Goal, Identity, and Result",
    personalize:
      "I (system) every day because I (name) am (new identity). My new life allows me to (enables what).",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    milestone:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.!",
  },
  {
    milestone:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    milestone: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

exports.generateUserMilestones = function (id) {
  return milestones.map((item) => {
    item["userId"] = id;
    return milestones;
  });
};
