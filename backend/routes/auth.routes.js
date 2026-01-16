import express from "express";
import {
  login,
  register,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();


/*  Auth */
authRouter.post("/register", register);
authRouter.post("/login", login);

/*  Forgot Password + OTP */
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;