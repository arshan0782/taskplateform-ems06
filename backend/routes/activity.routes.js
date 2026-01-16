import express from "express";
import { getLogs } from "../controllers/activity.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";


const activityRouter = express.Router();

activityRouter.get("/get-logs",authMiddleware ,adminOnly, getLogs)

export default activityRouter