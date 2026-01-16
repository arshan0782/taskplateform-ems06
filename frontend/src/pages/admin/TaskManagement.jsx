import { useEffect, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import TaskCard from "../../components/tasks/TaskCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import EditTaskModal from "../../components/tasks/EditTaskModal";
import Button from "../../components/common/Button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.post("/tasks/get-all-task");
      setTasks(res.data);
    } catch {
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/delete/${id}`);
      fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  return (
    <PageWrapper>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 md:mb-12 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
          <p className="text-sm text-gray-500">
            Create, update and manage all assigned tasks
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>+ Assign Task</Button>
      </div>

      {/* LOADER */}
      {loading && <Loader />}

      {/* EMPTY STATE */}
      {!loading && tasks.length === 0 && (
        <EmptyState message="No tasks available. Create your first task." />
      )}

      {/* TASK GRID */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#7dbac5] rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
            >
              {/* TASK INFO */}
              <TaskCard task={task} />

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4 bg">
                {/* EDIT */}
                <button
                  onClick={() => setEditTask(task)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-800  transition"
                >
                  <FiEdit2 size={14} />
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteTask(task._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-700 transition"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>

              {/* FEEDBACK */}
              {task.status === "Completed" && task.feedback && (
                <div className="mt-4 bg-[#37bde2]   border-gray-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-800 mb-1">
                    Employee Feedback
                  </p>
                  <p className="text-gray-600">{task.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchTasks}
        />
      )}

      {/* EDIT TASK MODAL */}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={fetchTasks}
        />
      )}
    </PageWrapper>
  );
};

export default TaskManagement;
