const nodemailer = require("nodemailer");
// const BASE_URL = process.env.BASE_URL;

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.UKRNET_EMAIL,
      pass: process.env.UKRNET_PASSWORD,
    },
  });

  const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.UKRNET_EMAIL,
    to: email,
    subject: "Verify Your Email",
    text: `Click the following link to verify your email: ${verificationLink}`,
    html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
