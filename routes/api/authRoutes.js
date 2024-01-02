const express = require("express");
const {
  registerUser,
  loginUser,
} = require("..//../controllers/userControllers");
const { checkToken } = require("..//../middlewares/authMiddleware");

const usersRouter = express.Router();

usersRouter.post("/users/register", registerUser);
usersRouter.post("/users/login", loginUser);

// Перевірка токена для захищених роутів
usersRouter.use("/users/protected", checkToken);

module.exports = usersRouter;
