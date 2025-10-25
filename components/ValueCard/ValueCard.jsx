const ValueCard = ({ title, description, borderColor }) => {
  const colorMap = {
    green: "#22C55E",
    blue: "#6495ED",
  };
  const color = colorMap[borderColor] || "#6495ED";

  return (
    <div
      className="card-lift bg-white rounded-xl p-6 shadow-md border-l-4 transition-all duration-300 hover:shadow-lg scroll-reveal"
      style={{ borderColor: color }}
    >
      <h4 className="text-xl font-bold mb-3" style={{ color: "#333333" }}>
        {title}
      </h4>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default ValueCard;
