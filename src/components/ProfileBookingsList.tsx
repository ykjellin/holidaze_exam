import { useEffect, useState } from "react";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  venue?: {
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
  };
}

interface BookingsListProps {
  profile: {
    name: string;
  };
  token: string | null;
  apiKey: string | null;
}

const ProfileBookingsList: React.FC<BookingsListProps> = ({
  profile,
  token,
  apiKey,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.name) return;

    const loadBookings = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${profile.name}/bookings?_venue=true`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey ?? "",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch bookings: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setBookings(data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch bookings:", error);
      }
    };

    loadBookings();
  }, [profile, token, apiKey]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!token || !apiKey) {
      console.error("❌ Missing authentication credentials.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmDelete) return;

    setDeleting(bookingId);

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete booking: ${response.status} ${response.statusText}`
        );
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.error("❌ Failed to cancel booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center">You have no upcoming bookings.</p>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div className="col-md-4 mb-4" key={booking.id}>
              <div className="card">
                <img
                  src={
                    booking.venue?.media?.[0]?.url ||
                    "https://placehold.co/300x200"
                  }
                  className="card-img-top"
                  alt={
                    booking.venue?.media?.[0]?.alt || `Booking ${booking.id}`
                  }
                />
                <div className="card-body">
                  <h5 className="card-title">{booking.venue?.name}</h5>
                  <p className="card-text">
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Check-out:</strong>{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={deleting === booking.id}
                  >
                    {deleting === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBookingsList;
