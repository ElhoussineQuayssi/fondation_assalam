import React from "react";
import Link from "next/link";

// Import extracted components
import Container from "../Container/Container.jsx";

const HeroSection = ({ title, subtitle, actions }) => (
  <section className="py-20 md:py-24" style={{ backgroundColor: "#B0E0E6" }}>
    <Container>
      <div className="text-center max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-6"
          style={{ color: "#333333" }}
        >
          {title}
        </h1>
        <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
              style={{ backgroundColor: "#6495ED", color: "white" }}
            >
              {action.text}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default HeroSection;
