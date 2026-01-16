import { useEffect, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import TaskStatusChart from "../../components/analytics/TaskStatusChart";
import EmployeeCompletionChart from "../../components/analytics/EmployeeCompletionChart";
import Loader from "../../components/common/Loader";

/* 🕒 Last 7 Days Helper */
const isLast7Days = (date) => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  return new Date(date) >= sevenDaysAgo;
};

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post("/tasks/get-all-task")
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ✅ FILTER: Last 7 Days Completed Tasks */
  const last7DaysCompletedTasks = tasks.filter(
    task =>
      task.status === "Completed" &&
      isLast7Days(task.updatedAt)
  );

  return (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-6">
        Analytics Dashboard
      </h2>

      {loading && <Loader />}

      {!loading && (
        <>
          {/* 📌 INFO BANNER */}
          <div className="mb-4 text-sm text-gray-600">
            Showing analytics based on <b>last 7 days completed tasks</b>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STATUS DISTRIBUTION (ALL TASKS) */}
            <TaskStatusChart tasks={tasks} />

            {/* COMPLETION RATE (LAST 7 DAYS) */}
            <EmployeeCompletionChart
              tasks={last7DaysCompletedTasks}
            />
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default Analytics;
