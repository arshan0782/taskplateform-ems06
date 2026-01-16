const colors = {
  Pending: "bg-yellow-300",
  "In Progress": "bg-blue-200",
  Completed: "bg-green-400"
};

const TaskStatusBadge = ({ status }) => (
  <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
    {status}
  </span>
);

export default TaskStatusBadge;
