import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../components/common/Toast";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [timer, setTimer] = useState(60);
  const [resendAllowed, setResendAllowed] = useState(false);

  // Timer for OTP
  useEffect(() => {
    if (mode === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendAllowed(true);
    }
  }, [mode, timer]);

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showToast("error", "All fields required");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      login(res.data);

      showToast("success", "Login Successful!");
      setTimeout(() => {
        window.location.href =
          res.data.user.role === "admin" ? "/admin" : "/employee";
      }, 600);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { email });
      showToast("success", "OTP sent!");
      setMode("otp");
      setTimer(60);
    } catch {
      showToast("error", "User not found!");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      showToast("success", "OTP Verified!");
      setMode("reset");
    } catch {
      showToast("error", "Invalid OTP!");
    }
  };

  // Reset Password
  const resetPassword = async () => {
    if (password !== confirmPass)
      return showToast("error", "Passwords do not match!");

    try {
      await api.post("/auth/reset-password", { email, password });
      showToast("success", "Password Reset!");
      setTimeout(() => setMode("login"), 600);
    } catch {
      showToast("error", "Failed to reset password");
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2000);
  };

  // Slide animation classes
  const slideClass = "transition-all duration-500 transform w-full";

  const hiddenLeft = "-translate-x-full opacity-0 absolute";
  const hiddenRight = "translate-x-full opacity-0 absolute";
  const visible = "translate-x-0 opacity-100";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="bg-white w-full max-w-md rounded-xl p-7 shadow-xl overflow-hidden relative">
        {/* Header + Back button */}
        {mode !== "login" && (
          <button
            onClick={() => setMode("login")}
            className="absolute left-4 top-4 text-gray-600 hover:text-black"
          >
            <FiArrowLeft size={22} />
          </button>
        )}

        <h2 className="text-xl font-bold text-center mb-6">
          {mode === "login" && "Welcome Back"}
          {mode === "forgot" && "Forgot Password?"}
          {mode === "otp" && "Verify OTP"}
          {mode === "reset" && "Reset Password"}
        </h2>

        {toast && <Toast {...toast} />}

        {/* LOGIN VIEW */}
        <form
          onSubmit={handleLogin}
          className={`${slideClass} ${mode === "login" ? visible : hiddenLeft}`}
        >
          {/* Email */}
          <input
            type="email"
            className="border p-3 w-full rounded mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="border p-3 w-full rounded pr-10"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            <p
              className="text-sm text-right text-blue-600 cursor-pointer"
              onClick={() => setMode("forgot")}
            >
              Forgot Password?
            </p>
          </div>

          <button className="bg-teal-600 hover:bg-teal-700 text-white w-full py-2.5 rounded text-[15px] font-medium transition disabled:opacity-60" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link Bottom */}
          <p className="text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>

        {/* FORGOT PASSWORD */}
        <div
          className={`${slideClass} ${
            mode === "forgot" ? visible : hiddenRight
          }`}
        >
          <input
            className="border p-3 w-full rounded mb-4"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="bg-teal-600 text-white py-3 rounded w-full"
          >
            Send OTP
          </button>
        </div>

        {/* OTP VERIFY */}
        <div
          className={`${slideClass} ${mode === "otp" ? visible : hiddenRight}`}
        >
          <input
            maxLength="6"
            className="border p-3 w-full text-center rounded mb-3"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          {!resendAllowed ? (
            <p className="text-sm text-gray-500 text-center mb-3">
              Resend in <span className="text-blue-700">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={sendOtp}
              className="text-blue-600 text-sm hover:underline mb-3 text-center w-full"
            >
              Resend OTP
            </button>
          )}

          <button
            onClick={verifyOtp}
            className="bg-blue-600 text-white py-3 rounded w-full"
          >
            Verify OTP
          </button>
        </div>

        {/* RESET PASSWORD */}
        <div
          className={`${slideClass} ${
            mode === "reset" ? visible : hiddenRight
          }`}
        >
          {/* New Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="border p-3 w-full rounded pr-10"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <input
              type={showConfirmPass ? "text" : "password"}
              className="border p-3 w-full rounded pr-10"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={resetPassword}
            className="bg-green-600 text-white py-3 rounded w-full"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
