import { useState } from "react";
import api from "../../api/axios";
import Button from "../common/Button";
import Toast from "../common/Toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AddEmployee = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const submit = async () => {
    const { name, email, phone, gender, password, confirmPassword } = form;

    if (!name || !email || !phone || !gender || !password || !confirmPassword) {
      showToast("All fields are required", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users/create", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        password,
      });

      showToast("Employee created successfully", "success");

      onCreated?.();

      setTimeout(() => {
        onClose();
      }, 800);

      setForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to create employee",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*  Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-90 rounded-xl p-5 shadow space-y-3">
          <h3 className="font-semibold text-lg">Add New Employee</h3>

          <input
            name="name"
            className="border p-2 w-full text-sm rounded"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            className="border p-2 w-full text-sm rounded"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            className="border p-2 w-full text-sm rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="gender"
            className="border p-2 w-full text-sm rounded"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/*  Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="border p-2 w-full text-sm rounded pr-10"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="border p-2 w-full text-sm rounded pr-10"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-sm border rounded"
            >
              Cancel
            </button>

            <Button onClick={submit} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
