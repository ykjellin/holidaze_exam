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
  price?: number;
  maxGuests?: number;
  media: { url: string; alt: string }[];
}

const VenueDetails = () => {
  const { id } = useParams();
  const { token, apiKey } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const response = await fetchData(`/venues/${id}?_media=true`);

        const venueData = response.data;
        if (!venueData.media || venueData.media.length === 0) {
          venueData.media = [
            { url: "https://placehold.co/600x400", alt: "Default Image" },
          ];
        }

        setVenue(venueData);
      } catch (err) {
        console.error("❌ Failed to fetch venue details:", err);
      }
    };

    loadVenueDetails();
  }, [id]);

  const handleNextImage = () => {
    if (venue && venue.media.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % venue.media.length);
    }
  };

  const handlePrevImage = () => {
    if (venue && venue.media.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? venue.media.length - 1 : prevIndex - 1
      );
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(null);
    setBookingError(null);

    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select both check-in and check-out dates.");
      return;
    }

    if (!venue || !token || !apiKey) {
      setBookingError("You must be logged in to book.");
      return;
    }

    try {
      const response = await fetchData(`/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          dateFrom: checkInDate.toISOString(),
          dateTo: checkOutDate.toISOString(),
          guests,
          venueId: id,
        }),
      });

      setBookingSuccess("Booking successful! Your stay is confirmed.");
      console.log("✅ Booking Created:", response);
    } catch (err) {
      setBookingError("❌ Booking failed. Please try again.");
      console.error("❌ Booking Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      {venue && (
        <div className="card mx-auto venue-details-card">
          <div className="image-carousel">
            <img
              src={
                venue.media[currentImageIndex]?.url ||
                "https://placehold.co/600x400"
              }
              className="carousel-image"
              alt={venue.media[currentImageIndex]?.alt || venue.name}
            />

            {venue.media.length > 1 && (
              <>
                <button
                  className="carousel-control prev"
                  onClick={handlePrevImage}
                >
                  ❮
                </button>
                <button
                  className="carousel-control next"
                  onClick={handleNextImage}
                >
                  ❯
                </button>
              </>
            )}
          </div>

          <div className="card-body">
            <h1 className="text-center">{venue.name}</h1>
            <p className="text-center lead">
              {venue.description || "No description available."}
            </p>
            <p>
              <strong>Price:</strong> $
              {venue.price ? venue.price.toFixed(2) : "N/A"} per night
            </p>
            <p>
              <strong>Max Guests:</strong> {venue.maxGuests || "N/A"}
            </p>

            {token && apiKey ? (
              <form onSubmit={handleBooking} className="mt-4">
                <h5>Book this Venue:</h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Check-in Date:</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      placeholderText="Select check-in date"
                      className="form-control"
                      minDate={new Date()}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Check-out Date:</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      placeholderText="Select check-out date"
                      className="form-control"
                      minDate={checkInDate || new Date()}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="mb-3">
                  <label>Number of Guests:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={guests}
                    min="1"
                    max={venue.maxGuests || 10}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>

                {/* Booking Messages */}
                {bookingError && (
                  <p className="alert alert-danger">{bookingError}</p>
                )}
                {bookingSuccess && (
                  <p className="alert alert-success">{bookingSuccess}</p>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Book Now
                </button>
              </form>
            ) : (
              <p className="alert alert-warning text-center mt-3">
                You must <Link to="/login">log in</Link> to book this venue.
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
