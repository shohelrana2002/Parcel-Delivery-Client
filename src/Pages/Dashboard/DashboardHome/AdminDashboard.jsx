import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, Doughnut } from "react-chartjs-2";
import { PackageCheck, Truck, ClipboardList, MoveRight } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";
import { Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const STATUS_ORDER = ["not_collected", "assigned", "picked_up", "delivered"];

const LABEL_MAP = {
  not_collected: "Not Collected",
  assigned: "Assigned",
  picked_up: "Picked Up",
  delivered: "Delivered",
};

const DashboardCharts = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["parcels-status-chart"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/parcels/delivery/status");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minute
  });

  // Generate counts based on expected statuses
  const countsByStatus = useMemo(() => {
    const map = {};
    (data || []).forEach((it) => {
      map[it.status] = Number(it.count || 0);
    });
    return STATUS_ORDER.map((s) => map[s] || 0);
  }, [data]);

  const hasData = (data || []).length > 0;

  const labels = STATUS_ORDER.map((s) => LABEL_MAP[s]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const datasetValues = hasData ? countsByStatus : [1, 2, 1, 5];

  const barData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Parcels ",
          data: datasetValues,
          backgroundColor: [
            "rgba(245,158,11,0.85)",
            "rgba(59,130,246,0.85)",
            "rgba(234,88,12,0.85)",
            "rgba(16,185,129,0.85)",
          ],
          borderRadius: 6,
          barThickness: 28,
        },
      ],
    }),
    [labels, datasetValues]
  );

  const doughnutData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: datasetValues,
          backgroundColor: [
            "rgba(245,158,11,0.9)",
            "rgba(59,130,246,0.9)",
            "rgba(234,88,12,0.9)",
            "rgba(16,185,129,0.9)",
          ],
          hoverOffset: 8,
        },
      ],
    }),
    [labels, datasetValues]
  );

  const commonOptions = {
    plugins: {
      legend: { position: "bottom" },
    },
    maintainAspectRatio: false,
    responsive: true,
  };
  const iconMap = {
    not_collected: <ClipboardList className="w-8 h-8 text-yellow-500" />,
    assigned: <MoveRight className="w-8 h-8 text-blue-500" />,
    picked_up: <Truck className="w-8 h-8 text-orange-500" />,
    delivered: <PackageCheck className="w-8 h-8 text-green-600" />,
  };
  const titleMap = {
    not_collected: "Not Collected",
    assigned: "Assigned",
    picked_up: "Picked Up",
    delivered: "Delivered",
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-56">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-md">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-600">
              Failed to load chart data
            </p>
            <p className="text-sm text-gray-600">{error?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-3 btn btn-sm bg-blue-600 text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

      <div className="grid grid-cols-1  cursor-pointer sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 border hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              {iconMap[item.status]}
              <span className="text-2xl font-bold text-gray-700">
                {item.count}
              </span>
            </div>

            <p className="text-gray-600 mt-4 font-medium">
              {titleMap[item.status]}
            </p>
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Parcel Status Overview</h3>
          <p className="text-sm text-gray-500">
            Live summary of parcels by status.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-ghost btn-sm bg-slate-100 hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Bar Chart */}
        <div className="col-span-2 bg-white border rounded-xl p-4 shadow-sm h-96">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Status (bar)
          </h4>
          <div className="h-[calc(100%-2rem)]">
            <Bar data={barData} options={commonOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Distribution
          </h4>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut data={doughnutData} options={commonOptions} />
            </div>

            <div className="mt-4 w-full">
              {labels.map((label, idx) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor:
                          barData.datasets[0].backgroundColor[idx],
                      }}
                    />
                    <span className="text-gray-700">{label}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {datasetValues[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
