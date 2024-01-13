const Joi = require("joi");
const usersSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(7).required(),
});

const validateUsers = async (req, res, next) => {
  try {
    await usersSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const handleNotFoundError = (res) => {
  return { message: "Not found" };
};

module.exports = {
  validateUsers,
  handleNotFoundError,
};
