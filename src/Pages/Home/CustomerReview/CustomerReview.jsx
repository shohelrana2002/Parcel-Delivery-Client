import React from "react";
import customerReview from "./../../../assets/customer-top.png";
import { Carousel } from "react-responsive-carousel";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import TestimonialsCard from "./TestimonialsCard";
import Marquee from "react-fast-marquee";
const testimonials = [
  {
    id: 1,
    name: "Rasel Ahamed",
    title: "CTO",
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    text: "Posture Pro helps you sit upright by gently aligning your spine and shoulders so you can stay comfortable throughout the day.",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Nasir Uddin",
    title: "CEO",
    text: "With the right posture, you reduce back pain and improve your focus. This device supports natural alignment easily.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "Ruma Akter",
    title: "Marketing Head",
    text: "Simple yet effective! It supports your posture and ensures long working hours don’t harm your back.",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 5,
    name: "Shakil Hasan",
    title: "UX Researcher",
    text: "After using this product, I noticed a big difference in my posture and confidence. Highly recommended!",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
];
const CustomerReview = () => {
  return (
    <div>
      <div className="flex gap-y-6 justify-center items-center flex-col">
        <img src={customerReview} alt="customerReview" />
        <h3 className="text-2xl md:text-4xl font-extrabold text-secondary">
          What our customers are sayings
        </h3>
        <p className="w-full md:w-8/12 text-center">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div className="bg-gray-50 py-16 flex justify-center">
        <div className="w-full relative">
          <Marquee
            gradient={true}
            speed={50}
            pauseOnHover={true}
            className="flex items-center"
          >
            {testimonials.map((item) => (
              <TestimonialsCard key={item.id} item={item} />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
