import React, { useState } from "react";
import { LogOut, Menu, User, PackageCheck } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import { FaBox, FaUserClock, FaUserCheck } from "react-icons/fa";
import { NavLink, Outlet, useLocation } from "react-router";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loader from "../Pages/Shared/Loader/Loader";

const DashboardLayout = () => {
  const { handleLogOut } = useAuth();
  const location = useLocation();
  const { role, roleLoading } = useUserRole();
  const [open, setOpen] = useState(false);

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

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
      icon: <FaBox className="w-5 h-5" />,
    },
  ];

  if (role === "admin") {
    navItems.push(
      {
        name: "Pending Riders",
        to: "pendingRiders",
        icon: <FaUserClock className="w-5 h-5" />,
      },
      {
        name: "Active Riders",
        to: "activeRiders",
        icon: <FaUserCheck className="w-5 h-5" />,
      },
      {
        name: "Make Admin",
        to: "makeAdmin",
        icon: <FaUserCheck className="w-5 h-5" />,
      }
    );
  }

  // 🚴 Rider role এর জন্য menu (optional)
  if (role === "rider") {
    navItems.push({
      name: "My Deliveries",
      to: "riderTasks",
      icon: <FaBox className="w-5 h-5" />,
    });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-blue-500 text-white p-4 flex justify-between items-center shadow relative">
        <button
          onClick={() => setOpen(!open)}
          className="absolute left-4 top-4 focus:outline-none"
        >
          {open ? <IoClose size={22} /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-semibold text-center w-full">
          My Dashboard
        </h1>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block bg-blue-100 text-gray-800 w-full md:w-64 p-5 space-y-3 transition-all duration-300 shadow-md`}
      >
        <ProFastLogo />

        <div className="flex flex-col justify-between h-[calc(100vh-120px)]">
          {/* Navigation Items */}
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm ${
                      isActive || item.activeMatch?.includes(location.pathname)
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

          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className="btn bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
             text-white w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg 
             transition-all duration-300 rounded-xl border-none mt-4"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
