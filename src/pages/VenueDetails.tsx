import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../api/api";
import { useAuth } from "../hooks/useAuth";
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
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
}

const VenueDetails = () => {
  const { id } = useParams();
  const { token, apiKey } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
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
      }
    };

    const loadBookings = async () => {
      if (!token || !apiKey) return;

      try {
        const response = await fetchData(`/bookings?venueId=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });
        setBookings(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      }
    };

    loadVenueDetails();
    if (token && apiKey) {
      loadBookings();
    }
    setLoading(false);
  }, [id, token, apiKey]);

  const isDateDisabled = (date: Date) => {
    return bookings.some((booking) => {
      let startDate = new Date(booking.dateFrom);
      let endDate = new Date(booking.dateTo);

      return date >= startDate && date <= endDate;
    });
  };

  useEffect(() => {
    let today = new Date();

    while (isDateDisabled(today)) {
      today.setDate(today.getDate() + 1);
    }

    setSelectedDate(today);
  }, [bookings]);

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
              <strong>Price:</strong> ${" "}
              {venue.price ? venue.price.toFixed(2) : "N/A"} per night
            </p>

            {/*  Calendar */}
            {token && apiKey ? (
              <div className="mt-4">
                <h5>Select an Available Date:</h5>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Select a date"
                  className="form-control"
                  filterDate={(date) => !isDateDisabled(date)}
                />
              </div>
            ) : (
              <p className="alert alert-warning text-center mt-3">
                You must <Link to="/login">log in</Link> to view available
                dates.
              </p>
            )}

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
