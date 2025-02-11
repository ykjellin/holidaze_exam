import { Link, useParams } from "react-router-dom";

const VenueDetails = () => {
  const { id } = useParams(); // Temp

  return (
    <div className="container mt-5">
      <h1 className="text-center">Venue Details</h1>
      <p className="text-center lead">Details for Venue {id}</p>

      <div className="card mx-auto" style={{ maxWidth: "600px" }}>
        <img
          src="https://placehold.co/600x400"
          className="card-img-top"
          alt={`Venue ${id}`}
        />
        <div className="card-body">
          <h5 className="card-title">Venue {id}</h5>
          <p className="card-text">
            This is a placeholder for the venue description.
          </p>
          <p>
            <strong>Location:</strong> Placeholder City
          </p>
          <p>
            <strong>Price:</strong> $XXX per night
          </p>
          <Link to="/venues" className="btn btn-secondary">
            Back to Venues
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
