import { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../components/common/Toast";


const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast , setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setToast({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...payload } = form;
      await api.post("/auth/register", payload);
      setToast({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      })
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        message:
        err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-7"
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Employee Registration
          </h2>
          <p className="text-sm text-gray-500">
            Create your account
          </p>
        </div>

        {/* ERROR */}
        {toast && (
         <Toast
         type={toast.type} message={toast.message} onClose={() => setToast(null)}/>
          
        )}

        {/* NAME */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2.5 w-full rounded text-[15px] mb-3 focus:ring-2 focus:ring-teal-500"
          required
          autoComplete="off"
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2.5 w-full rounded text-[15px] mb-3 focus:ring-2 focus:ring-teal-500"
          required
        />

        {/* PHONE */}
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2.5 w-full rounded text-[15px] mb-3 focus:ring-2 focus:ring-teal-500"
          required
        />

        {/* GENDER */}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2.5 w-full rounded text-[15px] mb-3 focus:ring-2 focus:ring-teal-500"
          required
          autoComplete="off"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2.5 w-full rounded text-[15px] pr-10 focus:ring-2 focus:ring-teal-500"
            required
            autoComplete="off"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-4">
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border p-2.5 w-full rounded text-[15px] pr-10 focus:ring-2 focus:ring-teal-500"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white w-full py-2.5 rounded text-[15px] font-medium transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* LOGIN */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
              className="text-[15px]  text-blue-600 hover:underline font-medium  cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
