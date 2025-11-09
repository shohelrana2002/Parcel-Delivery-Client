import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loader";
import useAuth from "../../../Hooks/useAuth";

const MakeAdmin = () => {
  const { user: loginEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [email, setEmail] = useState("");

  //  Fetch users dynamically based on email
  const {
    data: users = [],
    refetch,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchUsers", email],
    queryFn: async () => {
      if (!email) return [];
      const { data } = await axiosSecure.get(`/users/search?email=${email}`);
      return data;
    },
    enabled: false, // avoid fetching automatically
  });

  // Search Handler
  const handleSearch = () => {
    if (!email.trim()) return toast.error("Please enter an email!");
    refetch();
  };

  // Clear Handler
  const handleClear = () => {
    setEmail("");
  };

  // 🔄 Role Change Handler
  const handleChangeRole = async (userId, userEmail, currentRole) => {
    if (userEmail === loginEmail) {
      return Swal.fire("Oops!", "You cannot change your own role!", "warning");
    }

    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to change role to "${newRole}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, change!`,
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/update/role/${userId}`, {
          role: newRole,
          requesterEmail: loginEmail,
        });

        Swal.fire("Success!", `User role changed to ${newRole}`, "success");
        refetch();
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to update role",
          "error"
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        👑 Make Admin Panel
      </h2>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full sm:w-2/3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
          <button onClick={handleClear} className="btn btn-outline btn-error">
            Clear
          </button>
        </div>
      </div>

      {/* Loader */}
      {isFetching && <Loader />}

      {/* Error */}
      {isError && (
        <p className="text-red-500 text-center">{error?.message || "Error!"}</p>
      )}

      {/* Search Results */}
      {users.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="bg-gray-100">
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-success" : "badge-info"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {user.role === "admin" && user.email === loginEmail ? (
                      <button className="btn btn-sm btn-disabled">
                        Cannot Change
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleChangeRole(user._id, user.email, user.role)
                        }
                        className={`btn btn-sm ${
                          user.role === "admin" ? "btn-warning" : "btn-success"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Demote to User"
                          : "Make Admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!isFetching && users.length === 0 && email && (
        <p className="text-center text-gray-500 mt-4">
          😕 No users found for "{email}"
        </p>
      )}

      {!email && (
        <p className="text-center text-gray-400 mt-4">
          🔍 Type an email and click “Search” to get started
        </p>
      )}
    </div>
  );
};

export default MakeAdmin;
