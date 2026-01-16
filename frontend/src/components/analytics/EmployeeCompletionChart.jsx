import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const EmployeeCompletionChart = ({ tasks }) => {
  const map = {};

  tasks.forEach(t => {
    if (t.status === "Completed") {
      const name = t.assignedTo?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    }
  });

  const data = Object.entries(map).map(
    ([name, count]) => ({
      name,
      completed: count
    })
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">
        Employee Task Completion
      </h3>

      {data.length === 0 && (
        <p className="text-sm text-gray-500">
          No completed tasks yet
        </p>
      )}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="completed"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EmployeeCompletionChart;
