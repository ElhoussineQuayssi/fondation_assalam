const ImageTextSection = ({
  title,
  subtitle,
  features,
  buttonText,
  buttonHref,
  imagePosition = "right",
}) => (
  <section
    className={`relative py-20 md:py-24 mb-20 overflow-hidden scroll-reveal`}
    style={{ backgroundColor: "#B0E0E64D" }}
  >
    <div
      className="parallax-bg absolute inset-0 opacity-20"
      style={{ filter: "grayscale(100%)" }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center">
      {/* Text Content */}
      <div
        className={`md:w-1/2 ${imagePosition === "left" ? "md:order-2 md:pl-10" : "md:pr-10"} mb-8 md:mb-0`}
      >
        <div className="mb-4">
          <span className="font-semibold text-lg" style={{ color: "#6495ED" }}>
            POUR L'AUTONOMIE ET LA DIGNITÉ
          </span>
          <h2
            className={`text-4xl font-bold mt-2`}
            style={{ color: "#333333" }}
          >
            {title}
          </h2>
        </div>
        <p className={`text-lg mb-6`} style={{ color: "#333333" }}>
          {subtitle}
        </p>
        {features && (
          <ul
            className="list-disc list-inside space-y-2 mb-6"
            style={{ color: "#333333" }}
          >
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
        <a
          href={buttonHref}
          className="px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition duration-300 inline-block"
          style={{ backgroundColor: "#6495ED", color: "white" }}
        >
          {buttonText}
        </a>
      </div>

      {/* Image Placeholder */}
      <div
        className={`md:w-1/2 ${imagePosition === "left" ? "md:order-1" : ""}`}
      >
        <div
          className="w-full h-96 rounded-xl shadow-2xl border-2 flex items-center justify-center text-xl"
          style={{
            backgroundColor: "white",
            borderColor: "#6495ED80",
            color: "#333333",
          }}
        >
          [ Clean, Minimalist Illustration Placeholder ]
        </div>
      </div>
    </div>
  </section>
);

export default ImageTextSection;
