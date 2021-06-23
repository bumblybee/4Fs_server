var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const errorHandlers = require("./handlers/errorHandlers");
const { isAuth } = require("./middleware/isAuth");
const { authRole } = require("./middleware/authRole");
const roles = require("./enums/roles");

const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const accomplishmentsRouter = require("./routes/accomplishments");
const beliefsRouter = require("./routes/beliefs");
const fastingRouter = require("./routes/fasting");
const habitsRouter = require("./routes/habits");
const milestonesRouter = require("./routes/milestones");
const momentsRouter = require("./routes/moments");
const resourcesRouter = require("./routes/resources");
const skillsRouter = require("./routes/skills");
const sleepRouter = require("./routes/sleep");
const practicesRouter = require("./routes/practices");
const practiceWeeksRouter = require("./routes/practiceWeeks");
const sharedRouter = require("./routes/shared");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://four-fs.herokuapp.com",
      "https://4fs-member-portal.netlify.app",
      "https://app.4fsofweightloss.com",
    ],

    credentials: true,
  })
);

app.use(helmet());
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const morganLogStyle = app.get("env") === "development" ? "dev" : "common";
app.use(logger(morganLogStyle));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", [isAuth, authRole(roles.Admin)], adminRouter);
app.use("/users", usersRouter);

app.use("/accomplishments", isAuth, accomplishmentsRouter);
app.use("/beliefs", isAuth, beliefsRouter);
app.use("/fasting", isAuth, fastingRouter);
app.use("/habits", isAuth, habitsRouter);
app.use("/milestones", isAuth, milestonesRouter);
app.use("/moments", isAuth, momentsRouter);
app.use("/resources", isAuth, resourcesRouter);
app.use("/skills", isAuth, skillsRouter);
app.use("/sleep", isAuth, sleepRouter);
app.use("/practices", isAuth, practicesRouter);
app.use("/practice-weeks", isAuth, practiceWeeksRouter);
app.use("/shared", isAuth, sharedRouter);

app.use(errorHandlers.sequelizeErrorHandler);
app.use(errorHandlers.notFound);

// error handler
if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

if (process.env.NODE_ENV === "development") {
  console.log("Environment=Development");
}

if (process.env.NODE_ENV === "production") {
  console.log("Environment=Production");
}

module.exports = app;
