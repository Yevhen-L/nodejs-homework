const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticateToken };
