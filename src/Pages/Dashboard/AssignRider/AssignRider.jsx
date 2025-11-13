import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [filteredRiders, setFilteredRiders] = useState([]);

  // 🔍 Fetch parcels (paid + not_collected)
  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/parcels?payment_status=paid&delivery_status=not_collected`
      );
      return data.sort(
        (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
      );
    },
  });

  // 🔍 Fetch all active riders
  const { data: riders = [], isLoading: riderLoading } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users?status=active");

      return data;
    },
  });

  //  Watch selected parcel & filter riders dynamically
  useEffect(() => {
    if (selectedParcel && riders.length > 0) {
      const filtered = riders.filter(
        (r) =>
          r.upazila?.toLowerCase() ===
          selectedParcel.receiverUpazila?.toLowerCase()
      );
      setFilteredRiders(filtered);
    } else {
      setFilteredRiders([]);
    }
  }, [selectedParcel, riders]);

  const handleOpenAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRider("");
    document.getElementById("assign_modal").showModal();
  };

  //  Confirm Assign
  const handleAssignConfirm = async () => {
    if (!selectedRider) {
      toast.error("Please select a rider!");
      return;
    }

    setIsAssigning(true);
    try {
      const riderInfo = filteredRiders.find((r) => r.email === selectedRider);
      const res = await axiosSecure.patch(
        `/parcels/assign/${selectedParcel._id}`,
        {
          assigned_rider: selectedRider,
          delivery_status: "assigned",
          assigned_rider_id: riderInfo?._id,
          assigned_rider_name: riderInfo?.name,
        }
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Rider assigned successfully!");
        refetch();
        document.getElementById("assign_modal").close();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to assign rider!");
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading || riderLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Error loading parcels: {error.message}
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-5 text-center">
        🚚 Assign Rider to Paid Parcels
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          😕 No parcels available for assignment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Receiver Upazila</th>
                <th>Cost</th>
                <th>Delivery</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverUpazila}</td>
                  <td>{parcel.cost}৳</td>
                  <td>
                    <span className="badge badge-warning">
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenAssignModal(parcel)}
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                    >
                      <FaUserPlus /> Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🧾 Assign Rider Modal */}
      <dialog id="assign_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3 text-center text-blue-600">
            Assign Rider
          </h3>
          {selectedParcel && (
            <div className="mb-4 space-y-1 text-sm">
              <p>
                <strong>Parcel:</strong> {selectedParcel.title}
              </p>
              <p>
                <strong>Receiver:</strong> {selectedParcel.receiverName} (
                {selectedParcel.receiverUpazila})
              </p>
              <p>
                <strong>Cost:</strong> {selectedParcel.cost}৳
              </p>
            </div>
          )}

          <select
            className="select select-bordered w-full"
            value={selectedRider}
            onChange={(e) => setSelectedRider(e.target.value)}
          >
            <option disabled value="">
              {filteredRiders.length > 0
                ? "Select Rider"
                : "No Rider Found in This Upazila"}
            </option>
            {filteredRiders.map((rider) => (
              <option key={rider._id} value={rider.email}>
                {rider.name} — {rider.upazila}
              </option>
            ))}
          </select>

          <div className="modal-action">
            <button
              onClick={() => handleAssignConfirm()}
              disabled={isAssigning}
              className="btn bg-green-500 hover:bg-green-600 text-white"
            >
              {isAssigning ? "Assigning..." : "Confirm"}
            </button>
            <button
              onClick={() => document.getElementById("assign_modal").close()}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
