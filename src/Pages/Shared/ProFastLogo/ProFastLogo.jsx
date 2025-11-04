import logo from "../../../assets/logo.png";

const ProFastLogo = () => {
  return (
    <div className=" flex cursor-pointer items-end text-xl">
      <img src={logo} alt={logo} />
      <span className="text-orange-600 font-extrabold -ml-3">fast Service</span>
    </div>
  );
};

export default ProFastLogo;
