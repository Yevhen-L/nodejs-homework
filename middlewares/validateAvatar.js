const validateAvatar = (req, res, next) => {
  const { file } = req;
  if (!file || !file.mimetype.startsWith("image")) {
    return res.status(400).json({ message: "Invalid file format" });
  }
  next();
};

module.exports = validateAvatar;
