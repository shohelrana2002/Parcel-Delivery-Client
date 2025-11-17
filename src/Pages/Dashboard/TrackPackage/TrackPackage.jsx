/* eslint-disable no-unused-vars */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaTruckLoading } from "react-icons/fa";
// import { FaClock, FaTruckLoading, FaTruckFast } from "react-icons/fa6";

const TrackPackage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 🟦 Fetch parcels for user
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

  // Loading UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  // Error UI
  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        ⚠️ Failed to load: {error.message}
      </div>
    );
  }

  // Status Badge Function
  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return "badge badge-warning";
      case "picked_up":
        return "badge badge-info";
      case "delivered":
        return "badge badge-success";
      default:
        return "badge badge-neutral";
    }
  };

  const getStatusText = (status) => {
    if (status === "assigned") return "Assigned To Rider";
    if (status === "picked_up") return "Picked Up";
    if (status === "delivered") return "Delivered Successfully";
    return status;
  };

  // Step Active Logic
  const isActive = (current, target) => {
    const order = ["assigned", "picked_up", "delivered"];
    return order.indexOf(current) >= order.indexOf(target);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Helmet>
        <title>Fastest Dashboard | Track Package</title>
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          📦 Track Your Parcels ({parcels.length})
        </h1>
        <button onClick={refetch} className="btn btn-warning">
          Refresh
        </button>
      </div>

      {/* Empty UI */}
      {parcels.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No parcels found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <motion.div
              key={parcel._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-5"
            >
              {/* Title */}
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {parcel.title}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Tracking ID:
                <span className="font-mono font-semibold text-gray-900 ml-1">
                  {parcel.trackingNumber}
                </span>
              </p>

              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`${getStatusBadge(
                    parcel.delivery_status
                  )} p-3 text-sm`}
                >
                  {getStatusText(parcel.delivery_status)}
                </span>
              </div>

              {/* Progress Line */}
              <div className="flex items-center justify-between mb-5">
                <FaClock
                  className={`text-xl ${
                    isActive(parcel.delivery_status, "assigned")
                      ? "text-blue-600"
                      : "text-gray-300"
                  }`}
                />
                <div
                  className={`h-1 flex-1 mx-2 ${
                    isActive(parcel.delivery_status, "picked_up")
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                ></div>
                <FaTruckLoading
                  className={`text-xl ${
                    isActive(parcel.delivery_status, "picked_up")
                      ? "text-blue-600"
                      : "text-gray-300"
                  }`}
                />
                <div
                  className={`h-1 flex-1 mx-2 ${
                    isActive(parcel.delivery_status, "delivered")
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                ></div>
                <FaCheckCircle
                  className={`text-xl ${
                    parcel.delivery_status === "delivered"
                      ? "text-green-600"
                      : "text-gray-300"
                  }`}
                />
              </div>

              {/* Parcel Details */}
              <div className="text-sm space-y-1 text-gray-700">
                <p>
                  <strong>Sender:</strong> {parcel.senderName} —{" "}
                  {parcel.senderUpazila}, {parcel.senderDistrict}
                </p>
                <p>
                  <strong>Receiver:</strong> {parcel.receiverName} —{" "}
                  {parcel.receiverUpazila}, {parcel.receiverDistrict}
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
                        : "text-red-600"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </p>

                <p>
                  <strong>Rider:</strong>{" "}
                  {parcel.assigned_rider_name || "Not Assigned"}
                </p>

                <p>
                  <strong>Assigned:</strong>{" "}
                  {parcel.assigned_date
                    ? new Date(parcel.assigned_date).toLocaleString()
                    : "N/A"}
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
