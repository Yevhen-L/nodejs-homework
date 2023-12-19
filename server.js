require("colors");

const express = require("express");

const path = require("path");

const configPath = path.join(__dirname, ".", "config", ".env");

require("dotenv").config({ path: configPath });

const connectDB = require("./config/ConnectDB");
const notFoundRoutes = require("./middlewares/NotFoundRoutes");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// app.use(logger(formatsLogger));
// app.use(cors());
//

app.use("/api/v1", require("./routes/ContactsRoutes"));

app.use("*", notFoundRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const { PORT } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`.brightGreen.bold.italic);
});
