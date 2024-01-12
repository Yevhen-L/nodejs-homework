const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const {
  NotFoundRoutes: notFoundRoutes,
  errorHandler: errorHandler,
} = require("./middlewares/index");

const { contactsRouter, usersRouter } = require("./routes/api/index");

const app = express();
app.use(express.static("public"));
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/contacts", contactsRouter);
app.use("/users", usersRouter);

app.use("*", notFoundRoutes);
app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
