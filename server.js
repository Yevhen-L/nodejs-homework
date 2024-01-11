require("colors");

const app = require("./app");

const path = require("path");

const configPath = path.join(__dirname, ".", "config", ".env");

require("dotenv").config({ path: configPath });

const connectDB = require("./config/ConnectDB");

const { PORT } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`.brightGreen.bold.italic);
});
