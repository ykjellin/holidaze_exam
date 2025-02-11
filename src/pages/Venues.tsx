import { Link } from "react-router-dom";

const Venues = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Browse Venues</h1>
      <p className="text-center lead">
        Discover amazing venues for your next holiday.
      </p>

      <div className="row">
        {/* Placeholder */}
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div className="col-md-4 mb-4" key={id}>
            <div className="card">
              <img
                src="https://placehold.co/300x200"
                className="card-img-top"
                alt={`Venue ${id}`}
              />
              <div className="card-body">
                <h5 className="card-title">Venue {id}</h5>
                <p className="card-text">
                  A great place to stay with excellent amenities.
                </p>
                <Link to={`/venues/${id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;
