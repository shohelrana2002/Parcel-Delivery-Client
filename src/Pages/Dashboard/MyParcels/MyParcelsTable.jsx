const MyParcelsTable = ({
  parcels,
  handleDelete,
  handlePay,
  handleDetails,
}) => {
  console.log(parcels);

  return (
    <div className="overflow-x-auto mx-auto bg-white shadow-lg rounded-xl mt-6">
      <table className="table table-zebra w-full">
        {/* Table Head */}
        <thead className="bg-blue-600 text-white text-sm">
          <tr>
            <th>#</th>
            <th>Tracking</th>
            <th>Sender</th>
            <th>Address</th>
            {/* <th>Contact</th> */}
            <th>District</th>
            <th>Upazila</th>
            <th>Type</th>
            <th>Taka (৳)</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {parcels?.length > 0 ? (
            parcels.map((parcel, index) => (
              <tr
                key={parcel.trackingNumber}
                className="hover transition-all duration-200"
              >
                <th className="text-gray-700">{index + 1}</th>
                <td className="font-semibold text-blue-700">
                  {parcel.trackingNumber}
                </td>
                <td>{parcel.senderName}</td>
                <td>{parcel.senderAddress}</td>
                {/* <td>{parcel.senderContact}</td> */}
                <td>{parcel.senderDistrict}</td>
                <td>{parcel.senderUpazila}</td>
                <td>
                  <span className="badge badge-ghost badge-sm capitalize">
                    {parcel.type}
                  </span>
                </td>
                <td className="text-blue-800 font-semibold">
                  {parcel.cost}
                  <span className="text-red-400">৳</span>
                </td>
                {/* Payment Status */}
                <td>
                  <span
                    className={`badge capitalize text-white ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>

                {/* Action Buttons */}
                <td>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDetails(parcel._id)}
                      className="btn btn-xs btn-info text-white"
                    >
                      Details
                    </button>
                    {parcel.paymentStatus !== "paid" && (
                      <button
                        disabled={parcel.payment_status === "paid"}
                        onClick={() => handlePay(parcel._id)}
                        className="btn btn-xs btn-success text-white"
                      >
                        Pay ৳
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-xs btn-error text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
                className="text-center py-6 text-gray-500 font-medium"
              >
                No parcels found 😔
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcelsTable;
