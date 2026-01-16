import { FiTrash2 } from "react-icons/fi";

const UserTable = ({ users, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-6">
        No users found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, index) => (
            <tr
              key={u._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-2 border font-medium">
                {u.name}
              </td>

              <td className="px-4 py-2 border text-gray-600">
                {u.email}
              </td>

              <td className="px-4 py-2 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role}
                </span>
              </td>

             
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => onDelete(u._id)}
                  className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-xs"
                >
                  <FiTrash2 size={13} />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
