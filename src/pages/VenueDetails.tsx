import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  bookings?: number;
}

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

            {/* Calendar */}
            <div className="mt-4">
              <h5>Select an Available Date:</h5>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select a date"
                className="form-control"
              />
            </div>

            <Link to="/venues" className="btn btn-secondary mt-3">
              Back to Venues
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
