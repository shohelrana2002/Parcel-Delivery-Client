import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader/Loader";
import { Helmet } from "@dr.pogodin/react-helmet";

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const {
    data: activeRiders = [],
    refetch,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/riders/active");
      return data;
    },
  });

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`/riders/${id}`, { status: "pending" });
      Swal.fire("Deactivated!", "Rider status updated to pending.", "success");
      refetch();
    }
  };

  if (isLoading || isPending) return <Loader />;

  // 🔹 Filter active riders based on search text
  const filteredRiders = activeRiders.filter((rider) =>
    [rider.name, rider.email, rider.district, rider.upazila]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleClearSearch = () => setSearchText("");

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl mt-6 overflow-x-auto">
      <Helmet>
        <title>Fastest DashBoard || Active Rider</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Active Riders ({filteredRiders.length})
      </h2>

      {/* 🔹 Search Input + Clear Button */}
      <div className="flex justify-end mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name, email, district, upazila..."
          className="input input-bordered w-full max-w-xs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleClearSearch} className="btn btn-outline ">
          Clear
        </button>
      </div>

      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">District</th>
            <th className="border px-4 py-2">Upazila</th>
            <th className="border px-4 py-2">License</th>
            <th className="border px-4 py-2">NID</th>
            <th className="border px-4 py-2">Applied At</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRiders.map((rider, index) => (
            <tr key={rider._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                <img
                  src={rider.image}
                  alt={rider.name}
                  className="w-12 h-12 rounded-full mx-auto"
                />
              </td>
              <td className="border px-4 py-2">{rider.name}</td>
              <td className="border px-4 py-2">{rider.district}</td>
              <td className="border px-4 py-2">{rider.upazila}</td>
              <td className="border px-4 py-2">{rider.license}</td>
              <td className="border px-4 py-2">{rider.nid}</td>
              <td className="border px-4 py-2">
                {new Date(rider.applied_at).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeactivate(rider._id)}
                  className="btn btn-sm btn-warning"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveRider;
