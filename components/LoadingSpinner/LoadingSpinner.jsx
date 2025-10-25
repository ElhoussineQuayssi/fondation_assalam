const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12">
    <div
      className="animate-spin rounded-full h-8 w-8 border-4 border-transparent border-t-current"
      style={{ color: "#6495ED" }}
    ></div>
  </div>
);

export default LoadingSpinner;
