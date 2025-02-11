import { Link } from "react-router-dom";

const Profile = () => {
  const userEmail = "user@stud.noroff.no"; // Placeholder
  const isVenueManager = false; // Placeholder
  return (
    <div className="container mt-5">
      <h1 className="text-center">My Profile</h1>
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center">
          <img
            src="https://placehold.co/150"
            alt="User Avatar"
            className="rounded-circle mb-3"
          />
          <h5 className="card-title">Username</h5>
          <p className="card-text">user@example.com</p>
          <Link to="/edit-profile" className="btn btn-primary w-100 mb-2">
            Edit Profile
          </Link>
          <button className="btn btn-danger w-100">Logout</button>
        </div>
      </div>

      {/* Placeholder  */}
      {userEmail.endsWith("@stud.noroff.no") && !isVenueManager && (
        <div className="mt-4 text-center">
          <h2>Become a Venue Manager</h2>
          <p>As a venue manager, you can create and manage your own venues.</p>
          <button className="btn btn-success">Register as Venue Manager</button>
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-center">My Bookings</h2>
        <div className="row">
          {/* Placeholder  */}
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
                  <p className="card-text">Check-in: Placeholder Date</p>
                  <p className="card-text">Check-out: Placeholder Date</p>
                  <Link to={`/venues/${id}`} className="btn btn-primary">
                    View Venue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
