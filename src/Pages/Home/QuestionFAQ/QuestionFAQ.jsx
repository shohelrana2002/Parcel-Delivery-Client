import React from "react";
import QuestionFAQCard from "./QuestionFAQCard";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
const parcelFaqs = [
  {
    id: 1,
    question: "How can I track my parcel?",
    answer:
      "You can track your parcel using the tracking number provided at the time of shipment on our website or mobile app.",
  },
  {
    id: 2,
    question: "What is the estimated delivery time?",
    answer:
      "Delivery times vary depending on the origin and destination. Usually, parcels are delivered within 3-7 business days.",
  },
  {
    id: 3,
    question: "Can I change the delivery address after shipment?",
    answer:
      "Yes, you can request an address change before the parcel reaches the local hub, but additional charges may apply.",
  },
  {
    id: 4,
    question: "What should I do if my parcel is delayed?",
    answer:
      "If your parcel is delayed beyond the estimated delivery date, please contact our support team with your tracking number for assistance.",
  },
  {
    id: 5,
    question: "Are there restrictions on what I can send?",
    answer:
      "Yes, certain items like hazardous materials, liquids, and perishable goods may be restricted. Please check our shipping policy for details.",
  },
  {
    id: 6,
    question: "Is it possible to insure my parcel?",
    answer:
      "Yes, you can opt for parcel insurance during shipment. In case of loss or damage, you can claim compensation.",
  },
  {
    id: 7,
    question: "Can someone else receive my parcel?",
    answer:
      "Yes, the recipient can authorize another person to receive the parcel by providing valid ID and authorization proof.",
  },
];

const QuestionFAQ = () => {
  return (
    <div className="bg-[rgba(218,218,218,1)] w-full h-full py-24">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-xl md:text-4xl font-extrabold mb-5">
          Frequently Asked Question (FAQ)
        </h3>
        <p className="max-w-[600px] text-center my-3">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      {parcelFaqs.map((item) => (
        <QuestionFAQCard key={item.id} item={item} />
      ))}
      <div className="flex justify-center  items-center">
        <button className="btn btn-primary text-secondary">
          See More FAQ's{" "}
          <span>
            <FiArrowUpRight size={22} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuestionFAQ;
