const express = require("express");

// const controllers = require("..//../controllers/index");
// const UserControllers = controllers.userControllers;

const {
  userControllers: UserControllers,
} = require("..//../controllers/index");

const {
  validateAvatar: upload,
  authMiddleware: authenticateToken,
} = require("..//..//middlewares/index");

const usersRouter = express.Router();

usersRouter.post("/register", UserControllers.registerUser);
usersRouter.post("/login", UserControllers.loginUser);
usersRouter.get("/logout", authenticateToken, UserControllers.logOutUser);
usersRouter.get("/current", authenticateToken, UserControllers.getCurrentUser);

usersRouter.patch(
  "/avatars",
  authenticateToken,
  upload.single("avatar"),
  UserControllers.updateAvatar
);

// usersRouter.use("/users/protected", authenticateToken);

module.exports = usersRouter;
