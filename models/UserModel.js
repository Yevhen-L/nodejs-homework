const { model, Schema } = require("mongoose");
const gravatar = require("gravatar");
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: {
      type: String,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

// userSchema.pre("save", function (next) {
//   if (!this.avatarURL) {
//     this.avatarURL = gravatar.url(
//       this.email,
//       { s: "200", r: "pg", d: "mm" },
//       true
//     );
//   }
//   next();
// });

module.exports = model("users", userSchema);
