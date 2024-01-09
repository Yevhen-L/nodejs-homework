require("colors");

const express = require("express");

const path = require("path");
const configPath = path.join(__dirname, ".", "config", ".env");

require("dotenv").config({ path: configPath });

const connectDB = require("./config/ConnectDB");

const app = express();

const { PORT } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`.brightGreen.bold.italic);
});
