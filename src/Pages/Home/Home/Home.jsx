import React from "react";
import Banner from "../Banner/Banner";
import ServicesSection from "../ServicesSection/ServicesSection";
import HowItWorks from "../HowItWorks/HowItWorks";
import ClientLogoMarque from "../ClientLogoMarque/ClientLogoMarque";
import Benefits from "../Benefits/Benefits";

const Home = () => {
  return (
    <div>
      <Banner />
      <section className="bg-[rgba(148,198,203,0.2)] ">
        <HowItWorks />
        <ServicesSection />
        <ClientLogoMarque />
        <Benefits />
      </section>
    </div>
  );
};

export default Home;
