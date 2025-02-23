import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

interface Venue {
  id: string;
  name: string;
  media?: { url: string; alt?: string }[];
}

const Dashboard = () => {
  const { user, token, apiKey } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenues = async () => {
      if (!user || !token || !apiKey) return;

      try {
        const response = await fetchData(`/profiles/${user.name}/venues`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        setVenues(response.data || []);
      } catch (err) {
        console.error("❌ Failed to load venues:", err);
        setError("Failed to load venues.");
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [user, token, apiKey]);

  const handleDeleteVenue = async (venueId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      console.log(`🗑️ Deleting venue: ${venueId}`);

      await fetchData(`/venues/${venueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey ?? "",
        },
      });

      console.log("✅ Venue deleted successfully");

      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to delete venue:", err);
      alert("Failed to delete venue. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Venue Management</h1>

      <div className="text-center my-4">
        <Link to="/admin/create-venue" className="btn btn-success">
          + Create New Venue
        </Link>
      </div>

      {error && <p className="alert alert-danger text-center">{error}</p>}
      {loading && <p className="text-center">Loading venues...</p>}

      {!loading && venues.length === 0 && (
        <p className="text-center">You have no venues yet.</p>
      )}

      {!loading && venues.length > 0 && (
        <div className="list-group mx-auto mt-4" style={{ maxWidth: "600px" }}>
          {venues.map((venue) => (
            <div key={venue.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{venue.name}</h5>
                </div>
                <div>
                  <Link
                    to={`/admin/edit-venue/${venue.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/manage-bookings?venue=${venue.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Bookings
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteVenue(venue.id)}
                  >
                    Delete
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

export default Dashboard;
