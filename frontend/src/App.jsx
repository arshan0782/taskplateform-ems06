import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ActivityLog from "./pages/admin/ActivityLogs";
import ManageUsers from "./pages/admin/ManageUsers";
import Analytics from "./pages/admin/Analytics";
import TaskManagement from "./pages/admin/TaskManagement";

const App = () => {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ActivityLog />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <TaskManagement />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
