require("colors");

const express = require("express");

const path = require("path");

const configPath = path.join(__dirname, ".", "config", ".env");

require("dotenv").config({ path: configPath });

const connectDB = require("./config/ConnectDB");
const notFoundRoutes = require("./middlewares/NotFoundRoutes");
const errorHandler = require("./middlewares/errorHandler");

const contactsRouter = require("./routes/api/contactsRoutes");
const usersRouter = require("./routes/api/authRoutes");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";
// app.use(logger(formatsLogger));
// app.use(cors());
//

app.use("/contacts", contactsRouter);
app.use("/users", usersRouter);

app.use("*", notFoundRoutes);
app.use(errorHandler);

const { PORT } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`.brightGreen.bold.italic);
});
