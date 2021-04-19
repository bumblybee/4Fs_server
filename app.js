var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const errorHandlers = require("./handlers/errorHandlers");
const { isAuth } = require("./middleware/isAuth");

const exampleRouter = require("./routes/example");
const usersRouter = require("./routes/users");
const accomplishmentsRouter = require("./routes/accomplishments");
const beliefsRouter = require("./routes/beliefs");
const fastingWindowRouter = require("./routes/fastingWindows");
const habitsRouter = require("./routes/habits");
const milestonesRouter = require("./routes/milestones");
const momentsRouter = require("./routes/moments");
const resourcesRouter = require("./routes/resources");
const skillsRouter = require("./routes/skills");
const sleepRouter = require("./routes/sleep");
const systemRouter = require("./routes/system");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",

    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/example", exampleRouter);

app.use("/users", usersRouter);
app.use("/accomplishments", accomplishmentsRouter);
app.use("/beliefs", isAuth, beliefsRouter);
app.use("/fasting-window", isAuth, fastingWindowRouter);
app.use("/habits", isAuth, habitsRouter);
app.use("/milestones", isAuth, milestonesRouter);
app.use("/moments", isAuth, momentsRouter);
app.use("/resources", isAuth, resourcesRouter);
app.use("/skills", isAuth, skillsRouter);
app.use("/sleep", isAuth, sleepRouter);
app.use("/system", isAuth, systemRouter);

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
