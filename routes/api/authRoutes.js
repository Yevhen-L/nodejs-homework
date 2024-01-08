const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  getCurrentUser,
} = require("..//../controllers/userControllers");
const { authenticateToken } = require("..//../middlewares/authMiddleware");

const usersRouter = express.Router();

usersRouter.post("/users/register", registerUser);
usersRouter.post("/users/login", loginUser);
usersRouter.get("/users/logout", authenticateToken, logOutUser);
usersRouter.get("/users/current", authenticateToken, getCurrentUser);

// usersRouter.use("/users/protected", authenticateToken);

module.exports = usersRouter;
