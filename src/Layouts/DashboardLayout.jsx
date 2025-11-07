import React, { useState } from "react";
import { Menu } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";

const DashboardLayout = () => {
  const navItems = (
    <>
      <li>
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            `block px-3 py-3 text-center rounded-lg font-medium transition-all duration-300 shadow ${
              isActive
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`
          }
        >
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="MyParcels"
          className={({ isActive }) =>
            `block px-3 py-3 text-center rounded-lg font-medium transition-all duration-300 shadow ${
              isActive
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`
          }
        >
          My Parcels
        </NavLink>
      </li>
    </>
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Navbar for small screens */}
      <div className="md:hidden bg-blue-200 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-lg font-semibold text-center w-full">
          My Dashboard
        </h1>
        <button
          onClick={() => setOpen(!open)}
          className="absolute left-4 top-4 focus:outline-none"
        >
          {open ? <IoClose size={22} /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block bg-blue-100 text-white w-full md:w-64 p-5 space-y-3 transition-all duration-300`}
      >
        <ProFastLogo />
        <ul className="space-y-3">{navItems}</ul>
      </div>

      {/* Main Content (Outlet) */}
      <div className="flex-1 bg-gray-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
