import TaskStatusBadge from "./TaskStatusBadge";

const TaskCard = ({ task }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* TITLE */}
      <h3 className="text-lg font-semibold text-gray-00">
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-700">
        {task.description}
      </p>

      {/* ASSIGNED EMPLOYEE */}
      <div className="text-sm">
        <span className="text-gray-500">
          Assigned to:
        </span>{" "}
        <span className="font-medium text-gray-800">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      {/* STATUS */}
      <div className="mt-2">
        <TaskStatusBadge status={task.status} />
      </div>
    </div>
  );
};

export default TaskCard;
