import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { Helmet } from "@dr.pogodin/react-helmet";
// generate token tracking
const generateTrackingNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${datePart}-${randomPart}`;
};

const SendParcel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/data/area.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.log(err));
  }, []);

  const uniqueRegions = [...new Set(locations.map((loc) => loc.region))];

  const [parcelType, setParcelType] = useState("document");
  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  const senderDistricts = [
    ...new Set(
      locations.filter((l) => l.region === senderRegion).map((l) => l.district)
    ),
  ];
  const senderCenters =
    locations
      .filter((l) => l.region === senderRegion && l.district === senderDistrict)
      .map((l) => l.covered_area) || [];
  const receiverDistricts = [
    ...new Set(
      locations
        .filter((l) => l.region === receiverRegion)
        .map((l) => l.district)
    ),
  ];
  const receiverCenters =
    locations
      .filter(
        (l) => l.region === receiverRegion && l.district === receiverDistrict
      )
      .map((l) => l.covered_area) || [];

  //   calculate data
  //   const calculateCost = (data) => {
  //     // receiveCenter chi lo senderCenter-----------------------
  //     const { type, weight, senderDistrict, receiverDistrict } = data;
  //     const isWithinCity = senderDistrict === receiverDistrict;
  //     let cost = 0;

  //     if (type === "document") {
  //       cost = isWithinCity ? 60 : 80;
  //     } else if (type === "non-document") {
  //       const w = parseFloat(String(weight).trim()) || 0;
  //       if (w <= 3) {
  //         cost = isWithinCity ? 110 : 150;
  //       } else {
  //         const extraWeight = Math.max(0, w - 3);
  //         cost = isWithinCity
  //           ? 110 + extraWeight * 40
  //           : 150 + extraWeight * 40 + 40; // 3kg 40 per kg
  //       }
  //     }
  //     return cost;
  //   };
  const calculateCost = (data) => {
    const {
      type,
      weight,
      senderDistrict,
      receiverDistrict,
      senderUpazila,
      receiverUpazila,
    } = data;

    const w = parseFloat(String(weight).trim()) || 0;
    const isSameDistrict = senderDistrict === receiverDistrict;

    // Base prices
    let cost = 0;
    if (type === "document") {
      cost = isSameDistrict ? 60 : 80;
    } else if (type === "non-document") {
      // Base price for non-document
      cost = isSameDistrict ? 110 : 150;

      // Extra weight charge
      if (w > 3) {
        const extraWeight = w - 3;
        // For simplicity, 3-10kg -> 40/kg, 10-20kg -> 50/kg, 20+ -> 60/kg
        if (extraWeight <= 7) cost += extraWeight * 40;
        else if (extraWeight <= 17) cost += 7 * 40 + (extraWeight - 7) * 50;
        else cost += 7 * 40 + 10 * 50 + (extraWeight - 17) * 60;
      }

      // Extra charge if sender or receiver is non-sadar upazila
      const extraSadarCharge = 40;
      const isSenderNonSadar = !senderUpazila.toLowerCase().includes("sadar");
      const isReceiverNonSadar = !receiverUpazila
        .toLowerCase()
        .includes("sadar");

      if (!isSameDistrict) {
        if (isSenderNonSadar) cost += extraSadarCharge;
        if (isReceiverNonSadar) cost += extraSadarCharge;
      }
    }

    return cost;
  };
  const axiosSecure = useAxiosSecure();
  const onSubmit = (data) => {
    const cost = calculateCost(data);
    const created_by = user?.email;
    const creation_date = new Date().toISOString();
    const trackingNumber = generateTrackingNumber();
    Swal.fire({
      title: "Parcel Info & Cost",
      html: `
        <p>User Email:  ${created_by}</p>
        <p>Parcel Type: <b>${data.type}</b></p>
        <p>Weight: <b>${data.weight || 0} kg</b></p>
        <p>From: <b>${data.senderUpazila}, ${data.senderDistrict},${
        data.senderRegion
      }</b></p>
        <p>To: <b>${data.receiverUpazila}, ${data.receiverDistrict},${
        data.receiverRegion
      }</b></p>
        <p>Total Cost: <b>${cost} Taka</b></p>
        <p>Tracking Number: <b>${trackingNumber}</b></p>
      `,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "Edit Details",
      confirmButtonText: "Pay Now",
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          cost,
          delivery_status: "not_collected",
          payment_status: "unpaid",
          created_by,
          creation_date,
          trackingNumber,
        };
        axiosSecure.post("/parcels", parcelData).then((res) => {
          if (res.data?.insertedId) {
            Swal.fire("Success!", "Parcel Confirm .", "success");
            navigate("/dashboard/myParcels");
          }
        });
      }
    });
  };
  return (
    <div className="container mx-auto p-5 shadow-lg rounded-lg bg-white">
      <Helmet>
        <title>Fastest || Send Parcel</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-2 text-center">Send Parcel</h2>
      <p className="text-center mb-5 text-gray-500">
        Fill all the details to calculate delivery cost
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div className="border border-gray-200 p-4 rounded space-y-3">
          <h3 className="font-semibold text-lg">Parcel Info</h3>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="document"
                {...register("type", { required: true })}
                checked={parcelType === "document"}
                onChange={() => setParcelType("document")}
              />
              Document
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="non-document"
                {...register("type", { required: true })}
                checked={parcelType === "non-document"}
                onChange={() => setParcelType("non-document")}
              />
              Non-Document
            </label>
          </div>
          {errors.type && (
            <span className="text-red-500">Type is required</span>
          )}

          <label className="block font-medium">Parcel Type Title</label>
          <input
            type="text"
            placeholder="Enter Parcel Title"
            {...register("title", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}

          {parcelType === "non-document" && (
            <>
              <label className="block font-medium">Weight (kg)</label>
              <input
                min={0}
                type="number"
                placeholder="Enter Weight in kg"
                {...register("weight", { min: 0, required: true })}
                className="input input-bordered w-full"
              />
              {errors.weight && (
                <span className="text-red-500">Weight is required</span>
              )}
            </>
          )}
        </div>

        {/* Sender & Receiver Info */}
        <div className="flex md:flex-row flex-col gap-x-4">
          {/* Sender */}
          <div className="border border-gray-200 p-4 rounded space-y-3 flex-1">
            <h3 className="font-semibold text-lg">Sender Info</h3>

            <label className="block font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter Sender Name"
              {...register("senderName", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.senderName && (
              <span className="text-red-500">Name required</span>
            )}

            <label className="block font-medium">Contact</label>
            <input
              type="number"
              placeholder="Enter Contact Number"
              {...register("senderContact", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.senderContact && (
              <span className="text-red-500">Contact required</span>
            )}

            <label className="block font-medium">Region</label>
            <select
              {...register("senderRegion", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.senderRegion && (
              <span className="text-red-500">Region required</span>
            )}

            <label className="block font-medium">District</label>
            <select
              {...register("senderDistrict", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select District</option>
              {senderDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.senderDistrict && (
              <span className="text-red-500">District required</span>
            )}

            <label className="block font-medium">Select Your Upazila</label>
            <select
              {...register("senderUpazila", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Service/upazila Center</option>
              {senderCenters.flat().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.senderUpazila && (
              <span className="text-red-500">Service Center required</span>
            )}
            <label className="block font-medium">Sender Address</label>
            <textarea
              placeholder="Enter Address"
              {...register("senderAddress", { required: true })}
              className="input input-bordered w-full h-20"
            ></textarea>
            {errors.senderAddress && (
              <span className="text-red-500">Sender Address required</span>
            )}
            <label className="block font-medium">Pickup Instruction</label>
            <textarea
              placeholder="Enter Pickup Instruction"
              {...register("senderInstruction", { required: true })}
              className="input input-bordered w-full h-20"
            ></textarea>
            {errors.senderInstruction && (
              <span className="text-red-500">Instruction required</span>
            )}
          </div>

          {/* Receiver */}
          <div className="border p-4 border-gray-200 rounded space-y-3 flex-1">
            <h3 className="font-semibold text-lg">Receiver Info</h3>

            <label className="block font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter Receiver Name"
              {...register("receiverName", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.receiverName && (
              <span className="text-red-500">Name required</span>
            )}

            <label className="block font-medium">Contact</label>
            <input
              type="number"
              placeholder="Enter Contact Number"
              {...register("receiverContact", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.receiverContact && (
              <span className="text-red-500">Contact required</span>
            )}

            <label className="block font-medium">Region</label>
            <select
              {...register("receiverRegion", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.receiverRegion && (
              <span className="text-red-500">Region required</span>
            )}

            <label className="block font-medium">District</label>
            <select
              {...register("receiverDistrict", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select District</option>
              {receiverDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.receiverDistrict && (
              <span className="text-red-500">District required</span>
            )}

            <label className="block font-medium">Select Your Upazila</label>
            <select
              {...register("receiverUpazila", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Service/Upazila Center</option>
              {receiverCenters.flat().map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.receiverUpazila && (
              <span className="text-red-500">Upazila Center required</span>
            )}

            <label className="block font-medium">Receiver Address</label>
            <textarea
              placeholder="Enter Address"
              {...register("receiverAddress", { required: true })}
              className="input input-bordered w-full h-20"
            ></textarea>
            {errors.receiverAddress && (
              <span className="text-red-500">Receiver Address required</span>
            )}
            <label className="block font-medium">Delivery Instruction</label>
            <textarea
              placeholder="Enter Delivery Instruction"
              {...register("receiverInstruction", { required: true })}
              className="input input-bordered w-full h-20"
            ></textarea>
            {errors.receiverInstruction && (
              <span className="text-red-500">Instruction required</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
