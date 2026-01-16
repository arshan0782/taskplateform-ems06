import { useState } from "react";
import api from "../../api/axios";

const EditUserDetails = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    role: user.role || "employee",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await api.put(`/users/edit-details/${user._id}`, form); // DB UPDATE
      onUpdated();   // refresh users
      onClose();     // close modal
    } catch (err) {
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Edit User Details
        </h3>

        <div className="space-y-3 text-sm">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-4 py-2 text-sm rounded bg-teal-600 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;
