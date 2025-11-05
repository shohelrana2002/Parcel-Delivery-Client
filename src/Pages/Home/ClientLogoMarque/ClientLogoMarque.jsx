import React from "react";
import image1 from "../../../assets/brands/amazon.png";
import image2 from "../../../assets/brands/amazon_vector.png";
import image3 from "../../../assets/brands/casio.png";
import image4 from "../../../assets/brands/moonstar.png";
import image5 from "../../../assets/brands/randstad.png";
import image6 from "../../../assets/brands/start-people 1.png";
import image7 from "../../../assets/brands/start.png";
import Marquee from "react-fast-marquee";

const ClientLogoMarquee = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7];

  return (
    <div className="py-10 my-18 ">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
        We've helped thousands of sales teams
      </h2>

      <Marquee
        gradient={true}
        speed={50}
        pauseOnHover={true}
        className="flex items-center"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="mx-10 flex justify-center items-center hover:scale-110 transition-transform duration-300"
          >
            <img
              src={image}
              alt={`Client ${index + 1}`}
              className=" object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ClientLogoMarquee;
