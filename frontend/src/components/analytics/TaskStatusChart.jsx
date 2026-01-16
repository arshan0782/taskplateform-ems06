import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = {
  Pending: "#facc15",       
  "In Progress": "#3b82f6", 
  Completed: "#22c55e"      
};

const TaskStatusChart = ({ tasks }) => {
  const data = [
    { name: "Pending", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Completed", value: 0 }
  ];

  tasks.forEach(t => {
    const item = data.find(d => d.name === t.status);
    if (item) item.value += 1;
  });

  const hasData = data.some(d => d.value > 0);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">
        Task Status Distribution
      </h3>

      {!hasData && (
        <p className="text-sm text-gray-500">
          No task data available
        </p>
      )}

      {hasData && (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskStatusChart;
