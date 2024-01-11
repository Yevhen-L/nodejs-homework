const NotFoundRoutes = require("./NotFoundRoutes");
const errorHandler = require("./errorHandler");
const validateByID = require("./validateByID");
const authMiddleware = require("./authMiddleware");
const validateAvatar = require("./validateAvatar");

module.exports = {
  NotFoundRoutes,
  errorHandler,
  validateByID,
  authMiddleware,
  validateAvatar,
};
