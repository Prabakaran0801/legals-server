import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import User from "../models/User.js";

// Email and OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    // Save OTP in the database with user's email
    await User.findOneAndUpdate({ email }, { otp }, { upsert: true });

    // Send the OTP to the user's email
    // Nodemailer template
    const transporter = nodemailer.createTransport({
      service: "gmail.com",
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS,
      },
    });
    console.log("Recipient's Email:", email);
    const mailOptions = {
      from: "support@globallegals.com",
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Register Route
export const register = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // Validate OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email, otp },
      { password: hashedPassword, isVerified: true, otp: null },
      { new: true }
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// USER LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exists" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credential" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
    console.log("Login Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
