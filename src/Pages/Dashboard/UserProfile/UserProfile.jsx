import React, { useState } from "react";
import { User, Mail, Phone, CalendarDays, MapPin, Edit2 } from "lucide-react";
import useAuth from "../../../Hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../Firebase/Firebase";
import toast from "react-hot-toast";
import ImageUpload from "../../../Hooks/ImageUpload";
const UserProfile = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSave = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const image = form.image.files[0];

      const res = await ImageUpload(image);

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: res?.data?.url,
      });

      toast.success("Updated Success user");

      // data save TODO:
      setIsModalOpen(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto mt-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          My Profile
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        >
          <Edit2 size={16} />
          Edit
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2">
            <img
              src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="Profile"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {user?.displayName || "Unknown User"}
          </h3>

          <p className="flex items-center gap-2 text-gray-600">
            <Mail size={18} className="text-blue-500" />
            {user?.email || "No Email Found"}
          </p>

          <p className="flex items-center gap-2 text-gray-600">
            <Phone size={18} className="text-green-500" />
            013********45
          </p>

          <p className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={18} className="text-purple-500" />
            Joined:{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString(
                  "en-BD",
                  { dateStyle: "medium" }
                )
              : "N/A"}
          </p>

          <p className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} className="text-red-500" />
            Dhaka,Bangladesh
          </p>
        </div>
      </div>

      {/* ====== Modal ====== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-1/2 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              ✏️ Edit Profile
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label font-medium">Full Name</label>
                <input
                  defaultValue={user.displayName}
                  type="text"
                  name="name"
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="label font-medium">upload Your Image</label>
                <input
                  type="file"
                  name="image"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-medium">Phone Number</label>
                <input
                  defaultValue="013******56"
                  type="text"
                  name="phone"
                  className="input input-bordered w-full"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div>
                <label className="label font-medium">Location</label>
                <input
                  defaultValue="Dhaka,Bangladesh"
                  type="text"
                  name="location"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-warning"
                >
                  {loading ? "Updated..." : " Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
