import {
  FiUser,
  FiGrid,
  FiClock,
  FiCheckCircle,
  FiX
} from "react-icons/fi";

const EmployeeSidebar = ({
  user,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <FiGrid /> },
    { key: "active", label: "Active Tasks", icon: <FiClock /> },
    { key: "completed", label: "Completed Tasks", icon: <FiCheckCircle /> },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 md:z-auto
          top-0 left-0 h-screen w-64
          bg-white border rounded p-4
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="font-semibold flex items-center gap-2">
            <FiUser className="text-teal-600" />
            {user?.name}
          </h3>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* Desktop Header */}
        <h3 className="font-semibold mb-4 hidden md:flex items-center gap-2">
          <FiUser className="text-teal-600" />
          {user?.name}
        </h3>

        <ul className="space-y-2 text-sm">
          {menu.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setIsSidebarOpen(false);
              }}
              className={`cursor-pointer p-2 rounded flex items-center gap-2 ${
                activeTab === item.key
                  ? "bg-teal-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default EmployeeSidebar;
