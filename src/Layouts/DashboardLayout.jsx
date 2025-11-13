import React, { useState } from "react";
import {
  LogOut,
  Menu,
  User,
  PackageCheck,
  Settings,
  Truck,
} from "lucide-react";
import { IoClose } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import {
  FaBox,
  FaUserClock,
  FaUserCheck,
  FaUserShield,
  FaBicycle,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loader from "../Pages/Shared/Loader/Loader";

const DashboardLayout = () => {
  const { handleLogOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const [open, setOpen] = useState(false);

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md scale-[1.03]"
        : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"
    }`;

  // 🎯 Common User routes
  const userLinks = (
    <>
      <li>
        <NavLink to="myProfile" className={linkClass}>
          <User className="w-5 h-5" />
          <span>My Profile</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="myParcels" className={linkClass}>
          <PackageCheck className="w-5 h-5" />
          <span>My Parcels</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="paymentHistory" className={linkClass}>
          <BsClockHistory className="w-5 h-5" />
          <span>Payment History</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="trackPackage" className={linkClass}>
          <FaBox className="w-5 h-5" />
          <span>Track a Package</span>
        </NavLink>
      </li>
    </>
  );

  // 🚴 Rider routes
  const riderLinks = (
    <>
      <li>
        <NavLink to="pendingDelivery" className={linkClass}>
          <Truck className="w-5 h-5" />
          <span>Pending Deliveries</span>
        </NavLink>
      </li>

      {/* <li>
        <NavLink to="riderEarnings" className={linkClass}>
          <BsClockHistory className="w-5 h-5" />
          <span>Earnings</span>
        </NavLink>
      </li> */}
    </>
  );

  // 🛡️ Admin routes (see all)
  const adminLinks = (
    <>
      <li>
        <NavLink to="pendingRiders" className={linkClass}>
          <FaUserClock className="w-5 h-5" />
          <span>Pending Riders</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="assignRider" className={linkClass}>
          <FaBicycle className="w-5 h-5" />
          <span>Assign Rider</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="activeRiders" className={linkClass}>
          <FaUserCheck className="w-5 h-5" />
          <span>Active Riders</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="makeAdmin" className={linkClass}>
          <FaUserShield className="w-5 h-5" />
          <span>Make Admin</span>
        </NavLink>
      </li>

      {/* <li>
        <NavLink to="settings" className={linkClass}>
          <Settings className="w-5 h-5" />
          <span>Admin Settings</span>
        </NavLink>
      </li> */}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* 📱 Mobile Navbar */}
      <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center shadow relative">
        <button
          onClick={() => setOpen(!open)}
          className="absolute left-4 top-4 focus:outline-none"
        >
          {open ? <IoClose size={22} /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-semibold text-center w-full">Dashboard</h1>
      </div>

      {/* 🧭 Sidebar */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block bg-blue-100 text-gray-800 w-full md:w-64 p-5 space-y-3 transition-all duration-300 shadow-md`}
      >
        <ProFastLogo />

        <div className="flex flex-col justify-between h-[calc(100vh-120px)]">
          <ul className="space-y-2">
            {/* 🧠 Conditional Nav */}
            {userLinks}

            {!roleLoading && role === "rider" && riderLinks}

            {!roleLoading && role === "admin" && (
              <>
                {/* {riderLinks} */}
                {adminLinks}
              </>
            )}
          </ul>

          {/* 🚪 Logout Button */}
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

      {/* 📄 Main Content */}
      <div className="flex-1 bg-gray-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
