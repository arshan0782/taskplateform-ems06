import TaskStatusBadge from "../../components/tasks/TaskStatusBadge";

const TaskGrid = ({
  title,
  tasks,
  onStart,
  onComplete,
  onView,
}) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border rounded p-4 shadow flex flex-col"
          >
            {/* TITLE */}
            <h4 className="font-semibold mb-1">
              {task.title}
            </h4>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600 mb-3">
              {task.description}
            </p>

            {/* STATUS */}
            <div className="mb-4">
              <TaskStatusBadge status={task.status} />
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-auto ">
              {task.status === "Pending" && (
                <button
                  onClick={() => onStart(task)}
                  className="bg-blue-600 text-white px-3 py-1 rounded w-full cursor-pointer"
                >
                  Start Task
                </button>
              )}

              {task.status === "In Progress" && (
                <button
                  onClick={() => onComplete(task)}
                  className="bg-green-600 text-white px-3 py-1 rounded w-full cursor-pointer"
                >
                  Complete Task
                </button>
              )}

              {task.status === "Completed" && (
                <button
                  onClick={() => onView(task)}
                  className="text-sm text-blue-600 underline w-full"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskGrid;
