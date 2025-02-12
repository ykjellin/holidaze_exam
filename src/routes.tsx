import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/Layout.tsx";
import Home from "./pages/Home.tsx";
import Venues from "./pages/Venues.tsx";
import VenueDetails from "./pages/VenueDetails.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
import Dashboard from "./pages/admin/Dashboard.tsx";
import CreateVenue from "./pages/admin/CreateVenue.tsx";
import EditVenue from "./pages/admin/EditVenue.tsx";
import ManageBookings from "./pages/admin/ManageBookings.tsx";

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
