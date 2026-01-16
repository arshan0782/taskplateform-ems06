import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../common/Loader";

const Navbar = () => {
  const { user, logout, loggingOut } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      {/* LOGOUT LOADER */}
      {loggingOut && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <Loader />
          <p className="mt-3 text-gray-600 text-sm">
            Logging you out...
          </p>
        </div>
      )}

      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow">
        {/* BRAND */}
        <div
          onClick={() =>
            navigate(user?.role === "admin" ? "/admin" : "/employee")
          }
          className="text-lg font-semibold tracking-wide cursor-pointer"
        >
          LoG<span className="text-teal-400">o</span>
        </div>

        {/* NAVIGATION (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" className={({ isActive }) =>
                isActive ? "text-teal-400 font-medium" : "text-gray-300 hover:text-white"
              }>
                Dashboard
              </NavLink>

              <NavLink to="/admin/users" className={({ isActive }) =>
                isActive ? "text-teal-400 font-medium" : "text-gray-300 hover:text-white"
              }>
                Manage Employees
              </NavLink>

              <NavLink to="/admin/activity" className={({ isActive }) =>
                isActive ? "text-teal-400 font-medium" : "text-gray-300 hover:text-white"
              }>
                Activity
              </NavLink>

              <NavLink to="/admin/analytics" className={({ isActive }) =>
                isActive ? "text-teal-400 font-medium" : "text-gray-300 hover:text-white"
              }>
                Analytics
              </NavLink>
            </>
          )}

          {user?.role === "employee" && (
            <NavLink to="/employee" className={({ isActive }) =>
              isActive ? "text-teal-400 font-medium" : "text-gray-300 hover:text-white"
            }>
              My Tasks
            </NavLink>
          )}

          {/* USER INFO */}
          <div className="flex items-center gap-3 border-l border-gray-600 pl-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>

            <button
              onClick={logout}
              disabled={loggingOut}
              className="bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition disabled:opacity-60"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* MOBILE */}
        <div className="md:hidden flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            disabled={loggingOut}
            className="bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600 transition disabled:opacity-60"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
