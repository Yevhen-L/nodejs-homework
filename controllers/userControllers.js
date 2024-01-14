const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { userModel: UserModel } = require("..//models/index");

class userControllers {
  registerUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const gravatarURL = this.generateGravatarAvatar(email);

      const tmpFileName = `${Date.now()}_tmp_avatar.jpg`;
      const tmpPath = path.join(__dirname, "..", "tmp", tmpFileName);

      // Завантажуємо оригінал зображення в tmp
      await this.saveAvatarToTmp(gravatarURL, tmpPath);

      // Копіюємо оригінал до папки avatars
      const avatarFileName = `${Date.now()}_avatar.jpg`;
      const avatarPath = path.join(
        __dirname,
        "..",
        "public",
        "avatars",
        avatarFileName
      );
      await this.copyImage(tmpPath, avatarPath);

      // Обробляємо Jimp
      await this.processImage(avatarPath);

      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        avatarURL: `/avatars/${avatarFileName}`,
      });

      return res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  async processImage(sourcePath) {
    try {
      const image = await Jimp.read(sourcePath);
      await image.cover(250, 250);
      await image.writeAsync(sourcePath); // Переписано так, щоб перезаписати оригінальний файл
    } catch (error) {
      console.error(error);
      throw new Error("Error while processing avatar image");
    }
  }

  generateGravatarAvatar(email) {
    return gravatar.url(email, { s: "200", r: "pg", d: "mm" }, true);
  }

  async saveAvatarToTmp(avatarURL, tmpPath) {
    try {
      const image = await Jimp.read(avatarURL);
      await image.writeAsync(tmpPath);
    } catch (error) {
      console.error(error);
      throw new Error("Error while saving avatar image to tmp");
    }
  }

  async copyImage(sourcePath, destinationPath) {
    try {
      await fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      console.error(error);
      throw new Error("Error while moving avatar image");
    }
  }

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      user.token = token;
      await user.save();

      return res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  logOutUser = async (req, res) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      user.token = null;
      await user.save();

      res.status(200).json({ message: "User is logged out" });

      res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getCurrentUser = (req, res) => {
    try {
      const { email, subscription, avatarURL } = req.user;
      res.status(200).json({
        user: {
          email,
          subscription,
          avatarURL,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateAvatar = async (req, res) => {
    try {
      const { user } = req;
      const { file } = req;

      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const fileExtension = path.extname(file.originalname);
      const tmpFileName = `${user._id}_tmp_avatar${fileExtension}`;
      const avatarFileName = `${user._id}_${Date.now()}_${file.originalname}`;

      // Зберігаємо оригінал завантаженого зображення в tmp
      const tmpPath = path.join(__dirname, "..", "tmp", tmpFileName);
      await fs.writeFile(tmpPath, file.buffer);

      // Обробляємо Jimp
      const image = await Jimp.read(file.buffer);
      await image.cover(250, 250);

      // Зберігаємо оброблене зображення до папки avatars
      const avatarPath = path.join(
        __dirname,
        "..",
        "public",
        "avatars",
        avatarFileName
      );
      await image.writeAsync(avatarPath);

      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { avatarURL: `/avatars/${avatarFileName}` },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ avatarURL: updatedUser.avatarURL });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = new userControllers();
