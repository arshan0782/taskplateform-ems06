import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import EditUserDetails from "../../components/users/EditUserDetails";

/* 🔹 Small reusable detail row */
const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium text-gray-800">
      {value || "—"}
    </p>
  </div>
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/get-employees");
      setUsers(res.data);
      setSelectedUser(res.data[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await api.delete(`/users/delete-user/${id}`);
    fetchUsers();
  };

  /*  FILTER + SEARCH */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const roleMatch = role === "all" || u.role === role;
      const q = search.toLowerCase();
      const searchMatch =
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);

      return roleMatch && searchMatch;
    });
  }, [users, search, role]);

  return (
    <PageWrapper>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Employee Control Center
        </h2>
        <p className="text-sm text-gray-500">
          View, edit and manage registered users
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full md:w-72"
        />

        <div className="flex gap-2">
          {["all", "employee", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${
                role === r
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: USER LIST */}
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-gray-700">
            Registered Employees
          </h3>

          {loading && <Loader />}

          {!loading && filteredUsers.length === 0 && (
            <EmptyState message="No users found" />
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="space-y-2 max-h-105 overflow-y-auto">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-3 rounded cursor-pointer border text-sm transition ${
                    selectedUser?._id === u._id
                      ? "bg-teal-50 border-teal-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-gray-500">
                    {u.email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: USER DETAILS */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6">
          {!selectedUser && (
            <p className="text-gray-500">
              Select a user to view details
            </p>
          )}

          {selectedUser && (
            <>
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Registered User Profile
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    selectedUser.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {selectedUser.role}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <Detail label="Name" value={selectedUser.name} />
                <Detail label="Email" value={selectedUser.email} />
                <Detail label="Phone" value={selectedUser.phone} />
                <Detail label="Gender" value={selectedUser.gender} />
                <Detail
                  label="Account Created"
                  value={
                    selectedUser.createdAt
                      ? new Date(
                          selectedUser.createdAt
                        ).toLocaleDateString()
                      : "—"
                  }
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => setEditUser(selectedUser)}
                  className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Edit Details
                </button>

                <button
                  onClick={() => deleteUser(selectedUser._id)}
                  className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editUser && (
        <EditUserDetails
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={fetchUsers}
        />
      )}
    </PageWrapper>
  );
};

export default ManageUsers;
