import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import CreateEmployeeModal from "../../components/users/AddEmployee";
import {
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";


const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  /* FETCH TASKS */
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await api.post("/tasks/get-all-task");
      const map = {};

      res.data.forEach((task) => {
        const name = task.assignedTo?.name || "Unassigned";

        if (!map[name]) {
          map[name] = {
            name,
            total: 0,
            completed: 0,
            pending: 0,
          };
        }

        map[name].total++;

        task.status === "Completed"
          ? map[name].completed++
          : map[name].pending++;
      });

      setSummary(Object.values(map));
    } catch (err) {
      console.error("FETCH TASKS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchTasks();
  }, []);

  /* OVERALL STATS */
  const overall = useMemo(() => {
    const totalTasks = summary.reduce((a, b) => a + b.total, 0);
    const completed = summary.reduce((a, b) => a + b.completed, 0);
    const pending = summary.reduce((a, b) => a + b.pending, 0);

    return {
      employees: summary.length,
      totalTasks,
      completed,
      pending,
      completionRate:
        totalTasks === 0
          ? 0
          : Math.round((completed / totalTasks) * 100),
    };
  }, [summary]);

  return (
    <PageWrapper>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Task performance & workforce overview
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowTaskModal(true)}>
            + Assign Task
          </Button>
          <Button
            variant="success"
            onClick={() => setShowEmployeeModal(true)}
          >
            + Add Employee
          </Button>
        </div>
      </div>

      {/* LOADER */}
      {loading && <Loader />}

      {/* KPI CARDS */}
      {!loading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
  
  {/* EMPLOYEES */}
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
      <FiUsers size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Employees</p>
      <p className="text-2xl font-bold">{overall.employees}</p>
    </div>
  </div>

  {/* TOTAL TASKS */}
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-full bg-purple-50 text-purple-600">
      <FiClipboard size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Total Tasks</p>
      <p className="text-2xl font-bold">{overall.totalTasks}</p>
    </div>
  </div>

  {/* COMPLETED */}
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-full bg-green-50 text-green-600">
      <FiCheckCircle size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Completed</p>
      <p className="text-2xl font-bold text-green-600">
        {overall.completed}
      </p>
    </div>
  </div>

  {/* PENDING */}
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
      <FiClock size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">Pending</p>
      <p className="text-2xl font-bold text-yellow-600">
        {overall.pending}
      </p>
    </div>
  </div>

  {/* COMPLETION RATE */}
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-full bg-teal-50 text-teal-600">
      <FiTrendingUp size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">
        Completion Rate
      </p>
      <p className="text-2xl font-bold text-teal-600">
        {overall.completionRate}%
      </p>
    </div>
  </div>
</div>

      )}

      {/* EMPLOYEE PERFORMANCE */}
      {!loading && (
        <>
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">
            Employee Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summary.map((emp) => {
              const percent =
                emp.total === 0
                  ? 0
                  : Math.round(
                      (emp.completed / emp.total) * 100
                    );

              return (
                <div
                  key={emp.name}
                  className="bg-white border border-gray-400 rounded-xl p-5 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {emp.name}
                  </h4>

                  <div className="flex justify-between text-sm mb-3">
                    <span>Total: {emp.total}</span>
                    <span className="text-green-600">
                      Completed: {emp.completed}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {percent}% completed • {emp.pending} pending
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODALS */}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onCreated={() => {
            setShowTaskModal(false);
            fetchTasks(); // INSTANT DASHBOARD UPDATE
          }}
        />
      )}

      {showEmployeeModal && (
        <CreateEmployeeModal
          onClose={() => setShowEmployeeModal(false)}
        />
      )}
    </PageWrapper>
  );
};

export default AdminDashboard;
