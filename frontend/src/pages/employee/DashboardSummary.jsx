import { FiClipboard, FiClock, FiTrendingUp, FiCheckCircle } from "react-icons/fi";

const SummaryCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="text-white text-xl" />
    </div>

    <div className="text-left">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const DashboardSummary = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard
        label="Total Tasks"
        value={total}
        icon={FiClipboard}
        color="bg-blue-600"
      />

      <SummaryCard
        label="Pending"
        value={pending}
        icon={FiClock}
        color="bg-yellow-500"
      />

      <SummaryCard
        label="In Progress"
        value={progress}
        icon={FiTrendingUp}
        color="bg-purple-600"
      />

      <SummaryCard
        label="Completed"
        value={completed}
        icon={FiCheckCircle}
        color="bg-green-600"
      />
    </div>
  );
};

export default DashboardSummary;
