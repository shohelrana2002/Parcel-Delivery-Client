import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";

const PaymentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  const {
    data: parcelInfo,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels/${parcelId}`);
      return data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!elements || !stripe) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("[error]", error.message);
      setErrorMessage(error?.message);
    } else {
      //   now backend call here
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: parcelInfo?.cost,
        parcelId,
      });
      const clientSecret = res.data?.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });
      if (result.error) {
        setErrorMessage(error.message);
      } else if (result?.paymentIntent?.status === "succeeded") {
        setErrorMessage("");
        // save to data
        const paymentData = {
          parcelId,
          email: user.email,
          amount: parcelInfo?.cost,
          transitionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types,
          paid_at_string: new Date().toISOString(),
          paid_at: new Date(),
        };
        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data?.insertedId) {
          toast.success(" Payment Successful!");
          navigate("/dashboard/myParcels");
        }
      }
      //   console.log("paymentMethod", paymentMethod);
      //   console.log("frontend data send", result);
      setErrorMessage("");
    }
  };

  if (isError)
    return (
      <p className="text-red-500 text-center mt-5">
        Failed to load parcel info!
      </p>
    );
  if (isLoading || isPending) return <Loader />;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-5">
        💳 Secure Payment
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus-within:border-blue-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#e53e3e",
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="btn w-full text-secondary btn-primary"
      >
        Pay Now <span className=""> {parcelInfo?.cost} ৳</span>
      </button>
      {errorMessage && (
        <p className="text-center text-red-500">{errorMessage}</p>
      )}
      <p className="text-xs text-center text-gray-400 mt-3">
        🔒 Your payment information is encrypted and secure.
      </p>
    </form>
    // <form onSubmit={handleSubmit}>
    //   <CardElement
    //     options={{
    //       style: {
    //         base: {
    //           fontSize: "16px",
    //           color: "#424770",
    //           "::placeholder": {
    //             color: "#aab7c4",
    //           },
    //         },
    //         invalid: {
    //           color: "#9e2146",
    //         },
    //       },
    //     }}
    //   />
    //   <button type="submit" disabled={!stripe}>
    //     Pay
    //   </button>
    // </form>
  );
};

export default PaymentForm;
