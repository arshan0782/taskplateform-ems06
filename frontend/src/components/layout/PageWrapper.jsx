import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

const PageWrapper = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/tasks", label: "Task Management" },
    { to: "/admin/users", label: "Manage Employees" },
    { to: "/admin/activity", label: "Activity Logs" },
    { to: "/admin/analytics", label: "Analytics" },
    
  ];

  return (
    <>
      <Navbar />

      {/* MOBILE HEADER */}
      {user?.role === "admin" && (
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
          <h3 className="font-semibold text-lg">Admin Panel</h3>

          {/* MOBILE MENU ICON */}
          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-gray-800 h "
          >
            <FiMenu size={25} />
          </button>
        </div>
      )}

      <div className="flex min-h-screen relative">
        {/* DESKTOP SIDEBAR  */}
        {user?.role === "admin" && (
          <aside className="hidden md:block w-56 bg-gray-100 border-r p-4">
            <h3 className="font-semibold text-lg mb-4">
              Admin Panel
            </h3>

            <nav className="space-y-2">
              {adminLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-sm ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        )}

        {/* MOBILE SIDEBAR */}
        {open && (
          <>
            {/* OVERLAY */}
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* SLIDE SIDEBAR */}
            <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-gray-100 border-r p-4 md:hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  Admin Panel
                </h3>

                {/* ✕ CLOSE ICON */}
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl text-gray-800"
                >
                  <FiX />
                </button>
              </div>

              <nav className="space-y-2">
                {adminLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded text-sm ${
                        isActive
                          ? "bg-teal-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* CONTENT */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </>
  );
};

export default PageWrapper;
