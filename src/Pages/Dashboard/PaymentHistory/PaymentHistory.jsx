import React from "react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: paymentHistory = [],
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["history", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/payments?email=${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied!");
  };

  if (isLoading || isPending) return <Loader />;
  if (isError)
    return <p className="text-center text-red-500">Something went wrong.</p>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-md overflow-hidden">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5 text-center md:text-left">
        💳 Payment History ({paymentHistory?.length || 0})
      </h2>

      {paymentHistory.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No payment records found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="table w-full text-sm md:text-base">
            <thead className="bg-linear-to-r from-blue-600 to-green-600 text-white">
              <tr>
                <th className="py-3 text-center px-2">#</th>
                <th className="py-3 px-2">Transaction ID</th>
                <th className="py-3 text-center px-2 ">Email</th>
                <th className="py-3 text-center px-2">Amount (৳)</th>
                <th className="py-3 text-center px-2">Date</th>
                <th className="py-3 text-center px-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {paymentHistory.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50 transition-all duration-200 border-b border-gray-100"
                >
                  <td className="text-center font-semibold">{index + 1}</td>

                  <td
                    onClick={() => handleCopy(item.transitionId)}
                    className="font-mono text-xs md:text-sm cursor-pointer text-blue-700 hover:text-blue-900 tooltip tooltip-top"
                    data-tip="Click to copy Transaction ID"
                  >
                    <span className="flex items-center gap-1">
                      <span className="truncate max-w-[120px] md:max-w-[200px]">
                        {item.transitionId}
                      </span>
                      <span className="text-gray-400 text-xs">📋</span>
                    </span>
                  </td>

                  <td
                    data-tip={item.email}
                    className="text-gray-700  max-w-[140px] md:max-w-[200px]"
                  >
                    {item.email}
                  </td>

                  <td className="font-semibold text-green-600 text-center">
                    {item.amount}৳
                  </td>

                  <td className="text-gray-600 text-xs md:text-sm text-center">
                    {new Date(item.paid_at).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  <td className="text-center">
                    <span className="badge badge-success text-white">Paid</span>
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

export default PaymentHistory;
