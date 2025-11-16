import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import ImageUpload from "../../../Hooks/ImageUpload";
import { ThreeDots } from "react-loader-spinner";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Helmet } from "@dr.pogodin/react-helmet";

const BeARider = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const locationData = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const [preview, setPreview] = useState(null);

  // watch selected values
  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  // unique regions
  const uniqueRegions = [...new Set(locationData.map((d) => d.region))];

  // selected region এর districts
  // const districts =
  //   locationData
  //     .filter((item) => item.region === selectedRegion)
  //     .map((item) => item.district) || [];
  const districts = locationData
    .filter((item) => item.region === selectedRegion)
    .map((item) => item.district || []);
  // selected district এর upazilas
  const upazilas =
    locationData.find((item) => item.district === selectedDistrict)
      ?.covered_area || [];

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // toast.loading("Submitting application...", { id: "rider" });
      const imgFile = data.image[0];
      const image = await ImageUpload(imgFile);
      const imageURL = image.data.url;
      const newRider = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        region: data.region,
        district: data.district,
        upazila: data.upazila,
        nid: data.nid,
        bikeModel: data.bikeModel,
        license: data.license,
        image: imageURL,
        message: data.message,
        status: "pending",
        applied_at: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/riders", newRider);
      if (res.data?.insertedId) {
        toast.success(" Application submitted successfully!", { id: "rider" });
        reset();
      }
      setPreview(null);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.applied) {
        toast.error("You have already applied!");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <Helmet>
        <title>Fastest || Be Rider </title>
      </Helmet>
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        🚴‍♂️ Be A Rider Application
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              defaultValue={user?.displayName}
              readOnly={true}
              type="text"
              {...register("name", { required: true })}
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              defaultValue={user?.email}
              readOnly={true}
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone
            </label>
            <input
              type="text"
              {...register("phone", { required: true })}
              placeholder="Enter your phone number"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Bike Model
            </label>
            <input
              type="text"
              {...register("bikeModel", { required: "Bike Model is require" })}
              placeholder="Enter Your bike Model"
              className="input input-bordered w-full"
            />
            {errors.bikeModel && (
              <p className="text-red-500">{errors.bikeModel.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              NID Number
            </label>
            <input
              type="number"
              {...register("nid", { required: "Nid Number Is Required" })}
              placeholder="Enter your NID number"
              className="input input-bordered w-full"
            />
            {errors.nid && (
              <p className="text-red-500">{errors.license.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Driving License Number
            </label>
            <input
              type="number"
              {...register("license", { required: "License is required" })}
              placeholder="Enter your license number"
              className={`input input-bordered w-full ${
                errors.license ? "border-red-500" : ""
              }`}
            />
            {errors.license && (
              <p className="text-red-500 mt-1">{errors.license.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Region
            </label>
            <select
              {...register("region", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">-- Select Region --</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select District
            </label>
            <select
              {...register("district", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">-- Select District --</option>
              {districts.map((district, i) => (
                <option key={i} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Upazila
            </label>
            <select
              {...register("upazila", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">-- Select Upazila --</option>
              {upazilas.map((upa, i) => (
                <option key={i} value={upa}>
                  {upa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Your Image
            </label>
            <input
              type="file"
              {...register("image", { required: true })}
              accept="image/*"
              {...register("image")}
              onChange={handleImagePreview}
              className="file-input file-input-bordered w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 mt-2 rounded-lg border border-gray-300"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Short Message
            </label>
            <textarea
              {...register("message", { required: true })}
              placeholder="Tell us why you want to be a rider..."
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>
        </div>

        {/* Submit Button (full width, below both columns) */}
        <div className="md:col-span-2">
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary text-black w-full mt-4"
          >
            {loading ? (
              <>
                <ThreeDots /> wait
              </>
            ) : (
              " Apply Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
