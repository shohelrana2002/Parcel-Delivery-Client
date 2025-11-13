import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MyEarning = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch delivered parcels
  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myEarnings", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/parcels/delivery?email=${user?.email}&delivery_status=delivered`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch cashout history
  const { data: cashoutHistory = [] } = useQuery({
    queryKey: ["cashoutHistory", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/parcels/delivery?email=${user?.email}`
      );
      // Only include parcels that are cashed out
      return data.filter((p) => p.cash_out_status === "cashOut");
    },
    enabled: !!user?.email,
  });

  const totalEarning = (parcel) => {
    const cost = Number(parcel.cost || 0);
    return parcel.senderRegion === parcel.receiverRegion
      ? cost * 0.8
      : cost * 0.3;
  };

  // Total earnings
  const grandTotal = useMemo(() => {
    return deliveries.reduce((sum, p) => sum + totalEarning(p), 0);
  }, [deliveries]);

  // Total cashout
  const totalCashout = useMemo(() => {
    return cashoutHistory.reduce(
      (sum, c) => sum + Number(c.cash_out_amount || 0),
      0
    );
  }, [cashoutHistory]);

  // Remaining earnings
  const remainingEarning = useMemo(
    () => grandTotal - totalCashout,
    [grandTotal, totalCashout]
  );

  // Weekly / Monthly cashout
  const weeklyCashout = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return cashoutHistory
      .filter((c) => new Date(c.cash_out_at) >= oneWeekAgo)
      .reduce((sum, c) => sum + Number(c.cash_out_amount || 0), 0);
  }, [cashoutHistory]);

  const monthlyCashout = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return cashoutHistory
      .filter((c) => new Date(c.cash_out_at) >= oneMonthAgo)
      .reduce((sum, c) => sum + Number(c.cash_out_amount || 0), 0);
  }, [cashoutHistory]);

  // Chart data
  const chartData = useMemo(() => {
    const labels = cashoutHistory.map((c) =>
      new Date(c.cash_out_at).toLocaleDateString()
    );
    const dataSet = cashoutHistory.map((c) => Number(c.cash_out_amount || 0));
    return {
      labels,
      datasets: [
        {
          label: "Cashout Amount (৳)",
          data: dataSet,
          backgroundColor: "rgba(34,197,94,0.6)",
        },
      ],
    };
  }, [cashoutHistory]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">💰 My Earnings</h2>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Earnings</p>
          <p className="text-xl font-semibold">৳{grandTotal.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Cashout</p>
          <p className="text-xl font-semibold">৳{totalCashout.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Remaining Earnings</p>
          <p className="text-xl font-semibold">
            ৳{remainingEarning.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Weekly / Monthly cashout */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Cashout Last 7 Days</p>
          <p className="text-lg font-semibold">৳{weeklyCashout.toFixed(2)}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Cashout Last 30 Days</p>
          <p className="text-lg font-semibold">৳{monthlyCashout.toFixed(2)}</p>
        </div>
      </div>

      {/* Cashout chart */}
      <div className="mb-6 bg-white w-full h-[400px] p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2 text-gray-700">Cashout Trends</h3>
        {cashoutHistory.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-gray-500 text-center">No cashout history yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyEarning;
