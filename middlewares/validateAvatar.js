const multer = require("multer");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format"), false);
  }
};

const upload = multer({ storage, fileFilter });

const processAndMoveAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const newFileName = `${user._id}_avatar${path.extname(file.originalname)}`;
    const tmpPath = path.join("tmp", newFileName);
    const avatarPath = path.join("public", "avatars", newFileName);

    const image = await Jimp.read(file.buffer);
    await image.cover(250, 250).writeAsync(tmpPath);

    await fs.rename(tmpPath, avatarPath);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { avatarURL: `/avatars/${newFileName}` },
      { new: true }
    );

    res.status(200).json({ avatarURL: updatedUser.avatarURL });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { upload, processAndMoveAvatar };
