const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");

module.exports = asyncHandler((req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error(`ID ${id} is not valid!`);
  }
  next();
});
