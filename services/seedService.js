const milestones = [
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    body:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ex.!",
  },
  {
    body:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error ad, quam nostrum sed officia molestiae!",
  },
  {
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

exports.generateUserMilestones = function (id) {
  return milestones.map((item) => {
    item["userId"] = id;
    return milestones;
  });
};
