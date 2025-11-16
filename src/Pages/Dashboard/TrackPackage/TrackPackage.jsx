/* eslint-disable no-unused-vars */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import { motion } from "framer-motion";
import { Helmet } from "@dr.pogodin/react-helmet";

const TrackPackage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["track-parcels", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels?email=${user.email}`);
      return data.sort(
        (a, b) => new Date(b.assigned_date) - new Date(a.assigned_date)
      );
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load data: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Fastest DashBoard || Track Package</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          📦 Track Your Parcels{" "}
          <span className="font-extrabold text-yellow-900">
            {parcels?.length}
          </span>
        </h1>
        <button onClick={refetch} className="btn btn-warning">
          Refresh
        </button>
      </div>

      {parcels.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          😕 No assigned parcels found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <motion.div
              key={parcel._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {parcel.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Tracking ID:{" "}
                <span className="font-mono text-gray-700">
                  {parcel.trackingNumber}
                </span>
              </p>

              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-4">
                <FaBox
                  className={`text-xl ${
                    parcel.delivery_status === "not_collected"
                      ? "text-gray-400"
                      : "text-green-500"
                  }`}
                />
                <div
                  className={`flex-1 h-1 mx-2 ${
                    parcel.delivery_status === "assigned" ||
                    parcel.delivery_status === "in_transit" ||
                    parcel.delivery_status === "delivered"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <FaTruck
                  className={`text-xl ${
                    parcel.delivery_status === "in_transit" ||
                    parcel.delivery_status === "delivered"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />
                <div
                  className={`flex-1 h-1 mx-2 ${
                    parcel.delivery_status === "delivered"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <FaCheckCircle
                  className={`text-xl ${
                    parcel.delivery_status === "delivered"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Sender:</strong> {parcel.senderName} (
                  {parcel.senderUpazila}, {parcel.senderDistrict})
                </p>
                <p>
                  <strong>Receiver:</strong> {parcel.receiverName} (
                  {parcel.receiverUpazila}, {parcel.receiverDistrict})
                </p>
                <p>
                  <strong>Cost:</strong> {parcel.cost}৳
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      parcel.payment_status === "paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </p>
                <p>
                  Rider Name:{" "}
                  <span className=" text-gray-950">
                    {parcel.assigned_rider_name}
                  </span>
                </p>
                <p>
                  <strong>Assigned:</strong>{" "}
                  {new Date(parcel.assigned_date).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackPackage;
