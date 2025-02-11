import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Dashboard</h1>
      <div className="list-group mx-auto mt-4" style={{ maxWidth: "400px" }}>
        <Link
          to="/admin/create-venue"
          className="list-group-item list-group-item-action"
        >
          Create Venue
        </Link>
        <Link
          to="/admin/manage-bookings"
          className="list-group-item list-group-item-action"
        >
          Manage Bookings
        </Link>
        <Link to="/venues" className="list-group-item list-group-item-action">
          View All Venues
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
