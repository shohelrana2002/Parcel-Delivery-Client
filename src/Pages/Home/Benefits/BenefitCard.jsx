import React from "react";

const BenefitCard = ({ benefit }) => {
  return (
    <div className="flex md:flex-row bg-white flex-col items-center gap-8 cursor-pointer rounded-2xl p-6  hover:shadow-lg transition-all duration-300">
      <div className="flex justify-center items-center  rounded-full ">
        <img src={benefit.img} className="w-full" alt={benefit.title} />
      </div>
      <div className=" h-52 hidden md:flex divide-dotted  divider divider-horizontal"></div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {benefit.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
