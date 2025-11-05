import imag1 from "../../../assets/location-merchant.png";
import imag2 from "../../../assets/be-a-merchant-bg.png";

const BeMerchant = () => {
  return (
    <div className="hero relative bg-[rgba(3,55,61,1)] my-14 rounded-4xl">
      <div className="absolute w-full top-1 left-1">
        <img className="w-full object-cover" src={imag2} alt={imag2} />
      </div>
      <div className="hero-content p-20 flex-col lg:flex-row-reverse">
        <img src={imag1} className="w-full md:w-lg rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl text-white font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 text-white">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex gap-x-3">
            <button className="btn text-secondary rounded-2xl btn-primary ">
              Become a Merchant
            </button>
            <button className="btn btn-outline text-primary  rounded-2xl hover:bg-secondaryz">
              Earn with prof's Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
