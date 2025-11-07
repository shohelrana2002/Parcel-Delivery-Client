import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import MyParcelsTable from "./MyParcelsTable";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: parcels = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });
  if (isPending) return <Loader />;

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await axiosSecure.delete(`/parcels/${id}`).then((res) => {
          if (res.data?.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              timer: 1500,
            });
            refetch();
          }
        });
      }
    } catch (err) {
      // toast.error(err.response.data.message);
      toast.error(err?.message || "Something went wrong!");
    }
  };

  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  const handleDetails = (id) => {
    console.log("Details:", id);
  };
  return (
    <div className="px-5">
      <h2 className="text-2xl font-semibold mb-4">📦 My Parcels</h2>
      <MyParcelsTable
        parcels={parcels}
        handleDelete={handleDelete}
        handlePay={handlePay}
        handleDetails={handleDetails}
      />
    </div>
  );
};

export default MyParcels;
