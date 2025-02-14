import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../api/api";

interface Venue {
  id: string;
  name: string;
  description?: string;
  location?: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  price?: number;
  media: { url: string; alt: string }[];
}

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const response = await fetchData(`/venues/${id}`);
        setVenue(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch venue details:", err);
        setError("Could not load venue details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadVenueDetails();
  }, [id]);

  return (
    <div className="container mt-5">
      {loading && <p>Loading venue details...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && venue && (
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <img
            src={venue.media[0]?.url || "https://placehold.co/600x400"}
            className="card-img-top"
            alt={venue.media[0]?.alt || venue.name}
          />
          <div className="card-body">
            <h1 className="text-center">{venue.name}</h1>
            <p className="text-center lead">
              {venue.description || "No description available."}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {venue.location
                ? `${venue.location.address}, ${venue.location.city}, ${venue.location.zip}, ${venue.location.country}`
                : "Unknown"}
            </p>

            <p>
              <strong>Price:</strong> $
              {venue.price ? venue.price.toFixed(2) : "N/A"} per night
            </p>
            <Link to="/venues" className="btn btn-secondary">
              Back to Venues
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
