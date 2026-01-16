import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../../api/axios";
import Toast from "../../components/common/Toast";

const CreateTaskModal = ({ onClose, onCreated }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    priority: "Low",
    deadline: "",
    assignedTo: "",
    description: "",
  });

  //  Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  //  Toast helper
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  //  Fetch employees
  useEffect(() => {
    api
      .get("/users/get-employees")
      .then((res) =>
        setEmployees(res.data.filter((u) => u.role === "employee"))
      )
      .catch(() => showToast("Failed to load employees", "error"));
  }, []);

  const submit = async () => {
    if (!form.title || !form.assignedTo) {
      showToast("Title and employee are required", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/tasks/assign-task", form);

      const assignedEmployee = employees.find(
        (emp) => emp._id === form.assignedTo
      );

      showToast(
        `Task assigned successfully to ${assignedEmployee?.name || "employee"}`,
        "success"
      );

      // refresh dashboard
      setTimeout(() => {
        onCreated?.();
        onClose();
      }, 2000); //  toast visible time
    } catch (err) {
      showToast(err.response?.data?.message || "Task creation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*  Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold">Create Task</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Title */}
          <div className="mb-2">
            <label className="text-xs font-medium">Title</label>
            <input
              className="border rounded p-1.5 w-full mt-1 text-sm"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="mb-2">
            <label className="text-xs font-medium">Priority</label>
            <select
              className="border rounded p-1.5 w-full mt-1 text-sm"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Deadline */}
          <div className="mb-2">
            <label className="text-xs font-medium">Deadline</label>
            <input
              type="date"
              className="border rounded p-1.5 w-full mt-1 text-sm"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* Assign Employee */}
          <div className="mb-2">
            <label className="text-xs font-medium">Assign To</label>
            <select
              className="border rounded p-1.5 w-full mt-1 text-sm"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-xs font-medium">Description</label>
            <textarea
              rows={2}
              className="border rounded p-1.5 w-full mt-1 text-sm resize-none"
              placeholder="Short task description..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-sm border rounded"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="px-3 py-1.5 text-sm rounded bg-teal-600 text-white disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;
