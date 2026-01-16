import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../../api/axios";

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    deadline: "",
    assignedTo: ""
  });

  /* PREFILL */
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        deadline: task.deadline
          ? task.deadline.split("T")[0]
          : "",
        assignedTo: task.assignedTo?._id || ""
      });
    }
  }, [task]);

  /* FETCH EMPLOYEES */
  useEffect(() => {
    api.get("/users/get-employees")
      .then(res => setEmployees(res.data))
      .catch(() => setError("Failed to load employees"));
  }, []);

 
  const submit = async () => {
    if (!form.title || !form.assignedTo) {
      setError("Title and employee required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.put(`/tasks/update-task/${task._id}/edit`, form);

      onUpdated();
      onClose();
    } catch {
      setError("Task update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-2">{error}</p>
        )}

        <input
          className="border p-2 w-full mb-2 text-sm rounded"
          placeholder="Task title"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
        />

     

        <select
          className="border p-2 w-full mb-2 text-sm rounded"
          value={form.priority}
          onChange={e =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          className="border p-2 w-full mb-2 text-sm rounded"
          value={form.deadline}
          onChange={e =>
            setForm({ ...form, deadline: e.target.value })
          }
        />
           <textarea
          className="border p-2 w-full mb-2 text-sm rounded"
          rows={2}
          placeholder="Task description"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />

    
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
