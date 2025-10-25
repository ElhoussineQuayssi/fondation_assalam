const StatsCard = ({ title, value, color, description }) => (
  <div
    className={`card-lift bg-white rounded-xl p-6 shadow-lg border-t-4 text-center scroll-reveal transition duration-300 hover:shadow-xl hover:scale-[1.02]`}
    style={{ borderColor: "#6495ED" }}
  >
    <div className="text-3xl font-extrabold mb-1" style={{ color: "#6495ED" }}>
      {value}
    </div>
    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
      {title}
    </div>
    <div className="text-sm text-gray-700">{description}</div>
  </div>
);

export default StatsCard;
