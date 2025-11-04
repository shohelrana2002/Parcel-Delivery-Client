import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayout = () => {
  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="min-h-[calc(100vh-379px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
