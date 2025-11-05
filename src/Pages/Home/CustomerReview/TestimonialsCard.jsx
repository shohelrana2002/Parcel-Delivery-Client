import React from "react";
import quotation from "./../../../assets/reviewQuote.png";
const TestimonialsCard = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-2 flex flex-col items-center text-center mx-4">
      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-500 mb-1">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <img src={quotation} alt="quotation" />
      <p className="text-gray-600 italic leading-relaxed max-w-sm">
        “{item.text}”
      </p>
      <div className="divider divider-neutral"></div>
      <h4 className="font-semibold text-lg">{item.name}</h4>
      <p className="text-sm text-gray-500">{item.title}</p>
    </div>
  );
};

export default TestimonialsCard;
