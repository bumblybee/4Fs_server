const milestones = [
  {
    milestone:
      "1)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "2)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "3)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "4)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone: "5)Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    milestone:
      "6)Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.",
  },
  {
    milestone:
      "7)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "8)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone:
      "9)Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.!",
  },
  {
    milestone:
      "10)Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    milestone: "11)Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    milestone: "12)Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

exports.generateUserMilestones = function (id) {
  return milestones.map((item) => {
    item["userId"] = id;
    return milestones;
  });
};
