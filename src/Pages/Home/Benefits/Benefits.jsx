import React from "react";
import imag1 from "./../../../assets/download/Illustration.png";
import imag2 from "./../../../assets/download/Group 4.png";
import BenefitCard from "./BenefitCard";
const benefitsData = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    img: imag1,
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    img: imag2,
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    img: imag1,
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
  },
];
const Benefits = () => {
  return (
    <>
      <div className=" w-full hidden md:flex divide-dotted  divider "></div>
      <div className="flex flex-col gap-12 px-0 md:px-4 my-24 ">
        {benefitsData.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
      <div className=" w-full  hidden md:flex divide-dotted  divider "></div>
    </>
  );
};

export default Benefits;
