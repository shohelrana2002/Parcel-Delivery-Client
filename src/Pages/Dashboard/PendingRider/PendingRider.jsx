import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader/Loader";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch pending riders
  const {
    data: riders = [],
    isLoading,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/riders/pending");
      return data;
    },
  });

  // Action: Activate Rider
  const handleActivate = async (id, email) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Approved this rider!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Approved!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axiosSecure.patch(`/riders/${id}`, { status: "active", email });
        toast.success("Rider activated!");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to activate rider!", error?.message);
    }
  };

  // Action: Reject Rider
  const handleReject = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to reject this rider!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject!",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        await axiosSecure.patch(`/riders/${id}`, { status: "rejected" });
        toast.success("Rider rejected!");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to reject rider!", error?.message);
    }
  };
  const handelDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this rider!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        await axiosSecure.delete(`/riders/${id}`);
        toast.success("Rider delete !");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete rider!", error?.message);
    }
  };

  const handleView = (rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  if (isLoading || isPending) {
    return <Loader />;
  }

  return (
    <div className="overflow-x-auto mx-auto mt-6">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            {/* <th>Email</th> */}
            <th>Phone</th>
            <th>District</th>
            <th>Upazila</th>
            <th>License</th>
            <th>Status</th>
            <th>Applied At</th>
            <th className="text-center"> Action</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((rider, index) => (
            <tr key={rider._id}>
              <td>{index + 1}</td>
              <td>{rider.name}</td>
              {/* <td>{rider.email}</td> */}
              <td>{rider.phone}</td>
              <td>{rider.district}</td>
              <td>{rider.upazila}</td>
              <td>{rider.license}</td>
              <td className="text-orange-500">{rider.status}</td>
              <td>{new Date(rider.applied_at).toLocaleString()}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => handleView(rider)}
                  className="btn btn-sm btn-info"
                >
                  View
                </button>
                <button
                  onClick={() => handleActivate(rider._id, rider.email)}
                  className="btn btn-sm btn-success"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleReject(rider._id)}
                  className="btn btn-sm btn-warning b"
                >
                  Reject
                </button>
                <button
                  onClick={() => handelDelete(rider._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">
              {selectedRider.name}
            </h3>
            <div className="flex flex-col gap-2">
              <img
                src={selectedRider.image}
                alt={selectedRider.name}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Upazila:</strong> {selectedRider.upazila}
              </p>
              <p>
                <strong>License:</strong> {selectedRider.license}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Status:</strong> {selectedRider.status}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedRider.applied_at).toLocaleString()}
              </p>
              <p>
                <strong>Message:</strong> {selectedRider.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRider;
