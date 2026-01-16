import UserModel from "../models/User.model.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

/*************************
 * REGISTER USER
 *************************/
export const register = async (req, res) => {
  try {
    const { name, email, phone, gender, password } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await UserModel.create({
      name,
      email,
      phone,
      gender,
      password
    });

    res.status(201).json({
      message: "Employee registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};


/*************************
 * LOGIN USER
 *************************/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};


/*************************
 * SEND OTP
 *************************/
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min validity
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    await transporter.sendMail({
      from: `Task Platform <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully..." });

  } catch (error) {
    console.log(error.message); // debug important
    res.status(500).json({ message: "Error sending OTP" });
  }
};


/*************************
 * VERIFY OTP
 *************************/
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() }
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  res.json({ message: "OTP verified successfully" });
};


/*************************
 * RESET PASSWORD
 *************************/
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.updateOne(
    { email },
    { $set: { password: hashed, otp: null, otpExpires: null } }
  );

  res.json({ message: "Password reset successful" });
};