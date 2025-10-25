const TestimonialCard = ({ name, role, quote }) => (
  <div
    className="card-lift bg-white rounded-xl p-6 shadow-lg border-l-4 scroll-reveal border-accent"
  >
    <blockquote className="text-lg text-gray-700 mb-4 italic">
      "{quote}"
    </blockquote>
    <div className="flex items-center">
      <div className="ml-3">
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
