const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
} = require("..//../controllers/userControllers");
const { authenticateToken } = require("..//../middlewares/authMiddleware");

const usersRouter = express.Router();

usersRouter.post("/users/register", registerUser);
usersRouter.post("/users/login", loginUser);
usersRouter.post("/users/logout", authenticateToken, logOutUser);

usersRouter.use("/users/protected", authenticateToken);

module.exports = usersRouter;
