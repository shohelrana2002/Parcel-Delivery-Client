import { Link, NavLink } from "react-router";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
const Navbar = () => {
  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`
          }
        >
          About
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm gap-2 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        {/* logo */}
        <ProFastLogo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1"> {navItems}</ul>
      </div>
      <div className="navbar-end  gap-x-2">
        <Link to="/signin" className="btn">
          Sign In
        </Link>
        <Link to="/signup" className="btn btn-outline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
