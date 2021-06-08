const User = require("../db").User;

exports.authRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.token.data.id;

      const userRecord = await User.findOne({ where: { id: userId } });

      const { isAdmin } = userRecord;
      const role = isAdmin ? "Admin" : "Member";

      if (!userRecord) {
        return res.status(404).json({ error: "user.notFound" });
      } else if (!!requiredRoles && !isCorrectRole(requiredRoles, role)) {
        // TODO: send more specific error for admin fail
        return res.status(403).json({ error: "auth.invalidCredentials" });
      } else {
        return next();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const isCorrectRole = (requiredRoles, userRole) => {
  if (typeof requiredRoles === "string") {
    return userRole === requiredRoles;
  } else {
    return requiredRoles.includes(userRole);
  }
};
