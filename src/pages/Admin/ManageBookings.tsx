import { Link } from "react-router-dom";

const ManageBookings = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Manage Venue Bookings</h1>
      <div className="row mt-4">
        {[1, 2, 3].map((id) => (
          <div className="col-md-4 mb-4" key={id}>
            <div className="card">
              <img
                src="https://placehold.co/300x200"
                className="card-img-top"
                alt={`Booking ${id}`}
              />
              <div className="card-body">
                <h5 className="card-title">Booking {id}</h5>
                <p className="card-text">Guest: Placeholder Name</p>
                <p className="card-text">Check-in: Placeholder Date</p>
                <p className="card-text">Check-out: Placeholder Date</p>
                <Link
                  to={`/admin/edit-venue/${id}`}
                  className="btn btn-warning"
                >
                  Modify Venue
                </Link>
                <button className="btn btn-danger ms-2">Cancel Booking</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;
