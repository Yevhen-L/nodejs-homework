const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        user: { email: newUser.email, subscription: newUser.subscription },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  //======================================================================
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
        user: { email: user.email, subscription: user.subscription },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  //======================================================================
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
      const { email, subscription } = req.user;
      res.status(200).json({ email, subscription });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = new userControllers();
