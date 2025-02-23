import { useState, useEffect } from "react";
import { fetchData } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  customer: {
    name: string;
  };
  venue: {
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
  };
}

const ManageBookings = () => {
  const { user, token, apiKey } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !apiKey || !user?.name) {
      console.warn("⚠️ Missing authentication. Redirecting...");
      setError("Missing authentication credentials.");
      setLoading(false);
      return;
    }

    const loadBookings = async () => {
      try {
        const response = await fetchData(
          `/profiles/${user.name}/venues?_bookings=true`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        const venues = response.data || [];
        const venueBookings = venues.flatMap((venue: any) =>
          venue.bookings.map((booking: any) => ({
            id: booking.id,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            customer: { name: booking.customer?.name || "Unknown" },
            venue: {
              id: venue.id,
              name: venue.name,
              media: venue.media || [],
            },
          }))
        );

        setBookings(venueBookings);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, token, apiKey]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Venue Bookings</h1>
      {error && <p className="alert alert-danger text-center">{error}</p>}
      {loading && <p className="text-center">Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-center">No bookings found for your venues.</p>
      )}

      <div className="row mt-4">
        {bookings.map((booking) => (
          <div className="col-md-4 mb-4" key={booking.id}>
            <div className="card">
              <img
                src={
                  booking.venue.media?.[0]?.url ||
                  "https://placehold.co/300x200"
                }
                className="card-img-top"
                alt={
                  booking.venue.media?.[0]?.alt ||
                  `Booking for ${booking.venue.name}`
                }
              />
              <div className="card-body">
                <h5 className="card-title">{booking.venue.name}</h5>
                <p className="card-text">
                  <strong>Guest:</strong> {booking.customer.name}
                </p>
                <p className="card-text">
                  <strong>Check-in:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Check-out:</strong>{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;
