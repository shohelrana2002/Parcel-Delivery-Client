import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";
import Swal from "sweetalert2";
import { Helmet } from "@dr.pogodin/react-helmet";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";

const PendingDelivery = () => {
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch parcels assigned to rider
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingParcels", user.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/rider/parcels?email=${user.email}`
      );
      return data.sort(
        (a, b) => new Date(a.assigned_date) - new Date(b.assigned_date)
      );
    },
  });

  // Update delivery status
  const handleUpdateStatus = async (parcel, newStatus) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Mark parcel as "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(
        `/parcels/assign/statusUpdate/${parcel._id}`,
        {
          delivery_status: newStatus,
        }
      );
      console.log(parcel);
      if (res.data?.modifiedCount > 0) {
        Swal.fire({
          title: "Success!",
          text: `Parcel marked as "${newStatus}"`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        let trackDetails = `pick up By ${user.displayName}`;
        if (newStatus === "delivered") {
          trackDetails = `Delivered By ${user.displayName}`;
        }
        await logTracking({
          trackingId: parcel?.trackingNumber,
          status: newStatus,
          details: trackDetails,
          updatedBy: user?.email,
        });

        // ✅ Locally update status instantly without refetch
        queryClient.setQueryData(["pendingParcels", user.email], (oldData) =>
          oldData.map((p) =>
            p._id === parcel._id ? { ...p, delivery_status: newStatus } : p
          )
        );
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
      });
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        ❌ Error fetching parcels
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <Helmet>
        <title>Fastest DashBoard || Pending Delivery</title>
      </Helmet>
      <h2 className="text-2xl font-bold text-blue-600 mb-5 text-center">
        🛵 Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          😕 No pending deliveries found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Receiver</th>
                <th>Upazila</th>
                <th>Cost</th>
                <th>Delivery Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover">
                  <td>{index + 1}</td>
                  <td className="font-semibold">{parcel.title}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverUpazila}</td>
                  <td>{parcel.cost}৳</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.delivery_status === "assigned"
                          ? "badge-warning"
                          : parcel.delivery_status === "picked_up"
                          ? "badge-info"
                          : "badge-success"
                      }`}
                    >
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.payment_status === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td className="flex flex-col gap-2">
                    {parcel.delivery_status === "assigned" && (
                      <button
                        className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white"
                        onClick={() => handleUpdateStatus(parcel, "picked_up")}
                      >
                        Picked Up
                      </button>
                    )}

                    {parcel.delivery_status === "picked_up" && (
                      <button
                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleUpdateStatus(parcel, "delivered")}
                      >
                        Delivered
                      </button>
                    )}

                    {parcel.delivery_status === "delivered" && (
                      <span className="text-green-600 font-semibold">
                        ✅ Delivered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover">
                  <td>{index + 1}</td>
                  <td className="font-semibold">{parcel.title}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverUpazila}</td>
                  <td>{parcel.cost}৳</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.delivery_status === "assigned"
                          ? "badge-warning"
                          : parcel.delivery_status === "picked_up"
                          ? "badge-info"
                          : "badge-success"
                      }`}
                    >
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.payment_status === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td className="flex flex-col gap-2">
                    {parcel.delivery_status === "assigned" && (
                      <button
                        className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "picked_up")
                        }
                      >
                        Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "picked_up" && (
                      <button
                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "delivered")
                        }
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDelivery;
