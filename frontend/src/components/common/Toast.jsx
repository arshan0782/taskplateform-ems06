import { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999">

      <div
        className={`flex items-center gap-2 text-white px-4 py-2 rounded shadow-lg text-sm ${styles[type]}`}
      >
        {/* ICON */}
        {type === "success" && <FiCheckCircle size={18} />}
        {type === "error" && <FiX size={18} />}

        {/* MESSAGE */}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
