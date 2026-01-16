
import ActivityLogModel from "../models/ActivityLog.model.js";
import TaskModel from "../models/Task.model.js";

/* ===============================
   CREATE TASK (ADMIN)
================================ */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({
        message: "Title and assigned employee are required"
      });
    }

    if (priority && !["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const task = await TaskModel.create({
      title,
      description,
      priority,
      deadline,
      assignedTo
    });

    await ActivityLogModel.create({
      action: "TASK_CREATED",
      user: req.user.id,
      meta: { taskId: task._id }
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/* ===============================
   GET ALL TASKS (ADMIN)
================================ */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("FETCH TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ===============================
   MY TASKS (EMPLOYEE)
================================ */
export const myTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({
      assignedTo: req.user.id
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("MY TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ===============================
   UPDATE STATUS / FEEDBACK (EMPLOYEE)
================================ */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const validStatus = ["Pending", "In Progress", "Completed"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 Employee can update ONLY own task
    if (
      req.user.role === "employee" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (status) task.status = status;
    if (feedback) task.feedback = feedback;

    await task.save();

    await ActivityLogModel.create({
      action: feedback
        ? "FEEDBACK_SUBMITTED"
        : "STATUS_CHANGED",
      user: req.user.id,
      meta: { taskId: task._id, status }
    });

    res.json(task);
  } catch (err) {
    console.error("UPDATE TASK STATUS ERROR:", err);
    res.status(500).json({ message: "Task update failed" });
  }
};

/* ===============================
   UPDATE TASK (ADMIN FULL EDIT)
================================ */
export const updateTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;

    if (priority && !["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.deadline = deadline ?? task.deadline;
    task.assignedTo = assignedTo ?? task.assignedTo;
    

    await task.save();

    await ActivityLogModel.create({
      action: "TASK_UPDATED",
      user: req.user.id,
      meta: { taskId: task._id }
    });

    res.json(task);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Task update failed" });
  }
};

/* ===============================
   DELETE TASK (ADMIN)
================================ */
export const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    await ActivityLogModel.create({
      action: "TASK_DELETED",
      user: req.user.id,
      meta: { taskId: task._id }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};