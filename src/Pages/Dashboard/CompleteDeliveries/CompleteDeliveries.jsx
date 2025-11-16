import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { Helmet } from "@dr.pogodin/react-helmet";

const CompleteDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Rider earning per parcel
  const totalEarning = (parcel) => {
    const cost = Number(parcel.cost || 0);
    if (!parcel.senderRegion || !parcel.receiverRegion) return 0;
    return parcel.senderRegion === parcel.receiverRegion
      ? cost * 0.8
      : cost * 0.3;
  };

  // ✅ Load delivered parcels
  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completeDeliveries", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/parcels/delivery?email=${user?.email}&delivery_status=delivered`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // ✅ Total earnings
  const grandTotal = useMemo(() => {
    return deliveries.reduce((sum, parcel) => sum + totalEarning(parcel), 0);
  }, [deliveries]);

  // ✅ Handle single parcel cashout
  const handleCashout = async (parcelId, cashOut) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cashout this parcel earning?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Cashout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/parcels/cashOut/${parcelId}`, {
          cashOut,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Cashout Successful!",
            text: "Your earning has been marked as cashed out.",
            timer: 1500,
            showConfirmButton: false,
          });
          queryClient.invalidateQueries(["completeDeliveries", user?.email]);
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Something went wrong while cashing out.",
        });
      }
    }
  };

  // ✅ Handle total cashout

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading deliveries</p>;

  return (
    <div className="p-6">
      <Helmet>
        <title>Fastest DashBoard ||Complete Delivery</title>
      </Helmet>
      <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>

      {/* ✅ Total earnings summary */}
      <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mb-6 shadow-sm flex justify-between items-center">
        <p className="text-lg font-semibold">
          💰 Total Earnings: ৳{grandTotal.toFixed(2)}
        </p>
      </div>

      {deliveries.length === 0 ? (
        <p>No completed deliveries found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left border">#</th>
                <th className="px-4 py-2 text-left border">Title</th>
                <th className="px-4 py-2 text-left border">Receiver</th>
                <th className="px-4 py-2 text-left border">Address</th>
                <th className="px-4 py-2 text-left border">Delivered On</th>
                <th className="px-4 py-2 text-left border">Earned (৳)</th>
                <th className="px-4 py-2 text-left border">Cashout</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border font-semibold">
                    {parcel.title}
                  </td>
                  <td className="px-4 py-2 border">{parcel.receiverName}</td>
                  <td className="px-4 py-2 border">{parcel.receiverUpazila}</td>
                  <td className="px-4 py-2 border">
                    {new Date(parcel.assigned_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border text-green-600 font-medium">
                    {totalEarning(parcel).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {parcel.cash_out_status === "cashOut" ? (
                      <span className="text-gray-500 text-sm font-medium">
                        ✅ Cashed Out
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCashout(parcel._id, parcel.cost)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all"
                      >
                        Cashout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompleteDeliveries;
