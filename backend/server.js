import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import activityRouter from "./routes/activity.routes.js";
import connectDB from "./config/db.js";



dotenv.config();
connectDB();

const app = express();
app.use(cors(
  {
    origin:"https://taskplateform-emsbyarshan.vercel.app",
    credentials: true
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EMS Backend is running successfully ");
});


app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks",taskRouter);
app.use("/api/activity", activityRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
