import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoute";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import UserProfile from "../Pages/Dashboard/UserProfile/UserProfile";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackPackage from "../Pages/Dashboard/TrackPackage/TrackPackage";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRider from "../Pages/Dashboard/PendingRider/PendingRider";
import ActiveRider from "../Pages/Dashboard/ActiveRider/ActiveRider";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import ForbiddenAccess from "../Pages/ForbiddenAccess/ForbiddenAccess";
import AdminRoute from "../Routes/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDelivery from "../Pages/Dashboard/PendingDelivery/PendingDelivery";
import CompleteDeliveries from "../Pages/Dashboard/CompleteDeliveries/CompleteDeliveries";
import MyEarning from "../Pages/Dashboard/MyEarning/MyEarning";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import RiderRoute from "../Routes/RiderRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        element: <Coverage />,
      },
      {
        path: "/forbiddenAccess",
        Component: ForbiddenAccess,
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "/beArider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
        loader: () => fetch("/data/area.json").then((res) => res.json()),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "myProfile",
        element: <UserProfile />,
      },
      {
        path: "pendingDelivery",
        element: (
          <RiderRoute>
            <PendingDelivery />
          </RiderRoute>
        ),
      },
      {
        path: "completeDeliveries",
        element: (
          <RiderRoute>
            <CompleteDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "myEarning",
        element: <MyEarning />,
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payment />,
      },
      {
        path: "paymentHistory",
        element: <PaymentHistory />,
      },
      {
        path: "trackPackage",
        element: <TrackPackage />,
      },
      {
        path: "assignRider",
        element: <AssignRider />,
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRider />
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRider />
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
]);

//
