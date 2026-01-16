import { useContext, useEffect, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import { AuthContext } from "../../context/AuthContext";
import { FiMenu } from "react-icons/fi";

import EmployeeSidebar from "../employee/EmployeeSidebar";
import DashboardSummary from "../employee/DashboardSummary";
import EmpTaskGrid from "../employee/EmpTaskGrid";
import TaskStatusBadge from "../../components/tasks/TaskStatusBadge";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔥 IMPORTANT STATES
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState("");

  /* =====================
     FETCH TASKS
  ====================== */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* =====================
     FILTERS
  ====================== */
  const activeTasks = tasks.filter((t) => t.status !== "Completed");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return (
    <PageWrapper>
      {/* 🔹 MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button onClick={() => setIsSidebarOpen(true)}>
          <FiMenu size={22} />
        </button>
        <p className="font-semibold">{user?.name}</p>
      </div>

      <div className="flex gap-4">
        {/* 🔹 SIDEBAR */}
        <EmployeeSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* 🔹 MAIN CONTENT */}
        <main className="flex-1">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <h2 className="text-2xl font-semibold mb-6">
                Hi {user?.name} 👋
              </h2>
              <DashboardSummary tasks={tasks} />
            </>
          )}

          {/* ACTIVE TASKS */}
          {activeTab === "active" && (
            <EmpTaskGrid
              title="Active Tasks"
              tasks={activeTasks}
              onStart={(task) =>
                api
                  .put(`/tasks/update-task-status/${task._id}`, {
                    status: "In Progress",
                  })
                  .then(fetchTasks)
              }
              onComplete={(task) => {
                setSelectedTask(task);
                setFeedback("");
              }}
            />
          )}

          {/* COMPLETED TASKS */}
          {activeTab === "completed" && (
            <EmpTaskGrid
              title="Completed Tasks"
              tasks={completedTasks}
              onView={(task) => setSelectedTask(task)}
            />
          )}
        </main>
      </div>

      {/* =====================
         FEEDBACK MODAL
      ====================== */}
      {selectedTask && selectedTask.status !== "Completed" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Complete Task
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {selectedTask.title}
            </p>

            <textarea
              className="w-full border rounded p-2 text-sm mb-4"
              rows={4}
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.put(
                    `/tasks/update-task-status/${selectedTask._id}`,
                    {
                      status: "Completed",
                      feedback,
                    }
                  );

                  setSelectedTask(null);
                  fetchTasks();
                }}
                className="px-4 py-1 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================
         VIEW COMPLETED TASK
      ====================== */}
      {selectedTask && selectedTask.status === "Completed" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-2">
              {selectedTask.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              {selectedTask.description}
            </p>

            <div className="space-y-2 text-sm mb-4">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <TaskStatusBadge status={selectedTask.status} />
              </div>

              <p>
                <span className="font-medium">Priority:</span>{" "}
                {selectedTask.priority}
              </p>

              <p>
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(selectedTask.deadline).toLocaleDateString()}
              </p>
            </div>

            {selectedTask.feedback && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Feedback</p>
                <p className="text-sm text-gray-600">
                  {selectedTask.feedback}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Completed on{" "}
              {new Date(selectedTask.updatedAt).toLocaleString()}
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default EmployeeDashboard;
