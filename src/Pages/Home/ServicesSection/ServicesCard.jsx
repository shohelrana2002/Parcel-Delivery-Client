import {
  FaTruck,
  FaGlobeAsia,
  FaBoxes,
  FaMoneyBillWave,
  FaBuilding,
  FaUndo,
} from "react-icons/fa";

const iconMap = {
  "Express & Standard Delivery": <FaTruck className="text-blue-600 text-5xl" />,
  "Nationwide Delivery": <FaGlobeAsia className="text-blue-600 text-5xl" />,
  "Fulfillment Solution": <FaBoxes className="text-blue-600 text-5xl" />,
  "Cash on Home Delivery": (
    <FaMoneyBillWave className="text-blue-600 text-5xl" />
  ),
  "Corporate Service / Contract In Logistics": (
    <FaBuilding className="text-blue-600 text-5xl" />
  ),
  "Parcel Return": <FaUndo className="text-blue-600 text-5xl" />,
};

const ServicesCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:bg-[rgba(202,235,102,1)] hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer border border-gray-100">
      <div className="flex items-center justify-center mb-4">
        {iconMap[service.title]}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        {service.description}
      </p>
    </div>
  );
};

export default ServicesCard;
