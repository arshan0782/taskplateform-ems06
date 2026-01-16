
import ActivityLogModel from "../models/ActivityLog.model.js";

// Admin can get all activity logs
export const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLogModel.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); 

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch activity logs"
    });
  }
};