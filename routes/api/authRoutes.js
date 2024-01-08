const express = require("express");

const controllers = require("../../controllers/index");

const userControllers = controllers.userControllers;

const { authenticateToken } = require("..//../middlewares/authMiddleware");

const usersRouter = express.Router();

usersRouter.post("/register", userControllers.registerUser);
usersRouter.post("/login", userControllers.loginUser);
usersRouter.get("/logout", authenticateToken, userControllers.logOutUser);
usersRouter.get("/current", authenticateToken, userControllers.getCurrentUser);

// usersRouter.use("/users/protected", authenticateToken);

module.exports = usersRouter;
