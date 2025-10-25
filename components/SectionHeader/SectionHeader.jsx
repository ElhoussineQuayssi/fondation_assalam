const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12 scroll-reveal">
    <h2
      className={`text-4xl font-bold inline-block pb-1`}
      style={{ borderBottom: `3px solid #6495ED`, color: "#333333" }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={`text-lg mt-4 max-w-2xl mx-auto`}
        style={{ color: "#333333" }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
