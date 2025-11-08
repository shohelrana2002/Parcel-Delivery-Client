import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { NavLink, Outlet, useLocation } from "react-router";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";
import { User, PackageCheck } from "lucide-react";
import { BsClockHistory } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import useAuth from "../Hooks/useAuth";
const DashboardLayout = () => {
  const { handleLogOut } = useAuth();
  const location = useLocation();
  const navItems = [
    {
      name: "My Profile",
      to: "myProfile",
      icon: <User className="w-5 h-5" />,
      activeMatch: ["/dashboard"],
    },
    {
      name: "My Parcels",
      to: "myParcels",
      icon: <PackageCheck className="w-5 h-5" />,
    },
    {
      name: "Payment History",
      to: "paymentHistory",
      icon: <BsClockHistory className="w-5 h-5" />,
    },
    {
      name: "Track a Package",
      to: "trackPackage",
      icon: <FaLocationDot className="w-5 h-5" />,
    },
  ];
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
        <div className="flex justify-between min-h-10/12 flex-col">
          <div>
            <ul className="space-y-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm ${
                        isActive ||
                        item.activeMatch?.includes(location.pathname)
                          ? "bg-linear-to-r from-green-600 to-green-500 text-white shadow-md scale-[1.03]"
                          : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button
              onClick={handleLogOut}
              className="btn bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
             text-white w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg 
             transition-all duration-300 rounded-xl border-none"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (Outlet) */}
      <div className="flex-1 bg-gray-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
