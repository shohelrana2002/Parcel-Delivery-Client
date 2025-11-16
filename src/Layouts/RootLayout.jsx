import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

const RootLayout = () => {
  return (
    <HelmetProvider>
      <div className="container mx-auto">
        <Navbar />
        <div className="min-h-[calc(100vh-379px)]">
          <Outlet />
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default RootLayout;
