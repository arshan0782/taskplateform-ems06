import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  myTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/assign-task", authMiddleware, adminOnly, createTask);
taskRouter.post("/get-all-task", authMiddleware, adminOnly, getAllTasks);

taskRouter.get("/my-tasks", authMiddleware, myTasks);

taskRouter.put("/update-task-status/:id", authMiddleware, updateTaskStatus); // employee
taskRouter.put("/update-task/:id/edit", authMiddleware, adminOnly, updateTask); // admin
taskRouter.delete("/delete/:id", authMiddleware, adminOnly, deleteTask);

export default taskRouter;