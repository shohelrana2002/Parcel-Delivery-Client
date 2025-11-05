import React from "react";
import { Outlet } from "react-router";
import authentication from "../assets/authImage.png";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";
const AuthLayout = () => {
  return (
    <div className=" bg-base-200 p-2 md:p-12 container mx-auto">
      <ProFastLogo />
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex-1">
          <img src={authentication} className="" />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
