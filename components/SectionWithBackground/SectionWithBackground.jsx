const SectionWithBackground = ({
  children,
  variant = "none",
  className = "",
}) => {
  const bgColor = variant === "gray" ? "#B0E0E6" : "#FAFAFA";
  return (
    <section
      className={`py-16 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};

export default SectionWithBackground;
