const Button = ({ children, onClick, variant = "primary" }) => {
  const styles = {
    primary: "bg-blue-600 text-white",
    danger: "bg-red-500 text-white",
    success: "bg-green-600 text-white",
    outline: "border border-gray-400"
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
