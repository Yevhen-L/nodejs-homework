const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { userModel: UserModel } = require("../models/index");

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

      // Зберегти зображення у папці tmp
      const tmpFileName = `${Date.now()}_tmp_avatar.jpg`;
      const tmpPath = path.join(__dirname, "..", "tmp", tmpFileName);
      await this.saveAvatarToTmp(this.generateGravatarAvatar(email), tmpPath);

      // Зберегти користувача у базі даних
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        avatarURL: `/tmp/${tmpFileName}`, // Додайте URL до тимчасового файла в базу даних
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

  // Додатковий метод для генерації URL аватара з Gravatar
  generateGravatarAvatar(email) {
    return gravatar.url(email, { s: "200", r: "pg", d: "mm" }, true);
  }

  async saveAvatarToTmp(avatarURL, tmpPath) {
    // Завантажити зображення та зберегти його у папці tmp
    const image = await Jimp.read(avatarURL);
    await image.cover(250, 250);
    await image.writeAsync(tmpPath);
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

      // Перевірка авторизації
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Перевірка наявності файлу
      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const fileExtension = path.extname(file.originalname);
      const uniqueFileName = `${user._id}_avatar_${Date.now()}${fileExtension}`;

      // Обробка зображення
      const image = await Jimp.read(file.buffer);
      await image.cover(250, 250);

      // Шлях до папки tmp
      const tmpPath = path.join(__dirname, "..", "tmp", uniqueFileName);

      // Збереження обробленого зображення в папку tmp
      await image.writeAsync(tmpPath);

      // Шлях до папки public/avatars
      const avatarPath = path.join(
        __dirname,
        "..",
        "public",
        "avatars",
        uniqueFileName
      );

      // Перенесення обробленого зображення з tmp в public/avatars
      await image.writeAsync(avatarPath);

      // Оновлення користувача з новим URL аватарки
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { avatarURL: `/avatars/${uniqueFileName}` },
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

// registerUser, loginUser, logOutUser, getCurrentUser, updateAvatar;
