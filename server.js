require("dotenv").config();

// const app = require("./app");
const connectDB = require("./schemas/dbConnect");
// const PORT = process.env.PORT;
connectDB();

// app.listen(PORT, () => {
//   console.log("Server running. Use our API on port: 3000");
// });
