import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import {
  createEmployee,
  deleteUser,
  getEmployees,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/get-employees", authMiddleware, adminOnly, getEmployees);
userRouter.post("/create", authMiddleware, adminOnly, createEmployee);

userRouter.delete("/delete-user/:id", authMiddleware, adminOnly, deleteUser);
userRouter.put("/edit-details/:id", authMiddleware, adminOnly, updateUser);

export default userRouter;
