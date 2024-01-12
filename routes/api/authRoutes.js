const express = require("express");
const usersRouter = express.Router();
const {
  userControllers: UserControllers,
} = require("..//../controllers/index");

const { authenticateToken } = require("../../middlewares/authMiddleware");
const { upload } = require("..//../middlewares/validateAvatar");

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
