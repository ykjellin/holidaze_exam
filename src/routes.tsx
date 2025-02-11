import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import CreateVenue from "./pages/admin/CreateVenue";
import EditVenue from "./pages/admin/EditVenue";
import ManageBookings from "./pages/admin/ManageBookings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "venues", element: <Venues /> },
      { path: "venues/:id", element: <VenueDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <Profile /> },

      // Admin
      { path: "admin/dashboard", element: <Dashboard /> },
      { path: "admin/create-venue", element: <CreateVenue /> },
      { path: "admin/edit-venue/:id", element: <EditVenue /> },
      { path: "admin/manage-bookings", element: <ManageBookings /> },

      // 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
