const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format"), false);
  }
};
const upload = multer({ storage, fileFilter });

module.exports = upload.single("avatar");
