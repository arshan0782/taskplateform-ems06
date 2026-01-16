const EmptyState = ({ message = "No data found" }) => (
  <div className="text-center text-gray-500 py-10">
    {message}
  </div>
);

export default EmptyState;
