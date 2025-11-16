import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { Helmet } from "@dr.pogodin/react-helmet";
const stripePromise = loadStripe(import.meta.env.VITE_STRIP);
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <Helmet>
        <title>Fastest DashBoard || payment</title>
      </Helmet>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
