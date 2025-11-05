import {
  FaTruckPickup,
  FaBoxOpen,
  FaMoneyBillWave,
  FaSmileBeam,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaTruckPickup className="text-blue-600 text-5xl mb-4" />,
    title: "Booking Pick & Drop",
    desc: "Easily schedule pickup and drop for your parcel anytime, anywhere.",
  },
  {
    icon: <FaBoxOpen className="text-blue-600 text-5xl mb-4" />,
    title: "Package Handling",
    desc: "Your package is carefully packed, labeled, and tracked securely.",
  },
  {
    icon: <FaMoneyBillWave className="text-blue-600 text-5xl mb-4" />,
    title: "Cash on Delivery",
    desc: "We collect payment on your behalf and send it safely to you.",
  },
  {
    icon: <FaSmileBeam className="text-blue-600 text-5xl mb-4" />,
    title: "Delivered Successfully",
    desc: "Your parcel reaches the customer with satisfaction guaranteed.",
  },
];
const HowItWorks = () => {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] my-12 py-12">
      <h2 className="text-3xl font-bold  text-gray-800 mb-10">How It Works</h2>

      <div className="grid bg-[rgba(255,255,255,0.)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6  mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="hover:bg-[rgba(202,235,102,1)] bg-white cursor-pointer rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            {step.icon}
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {step.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
