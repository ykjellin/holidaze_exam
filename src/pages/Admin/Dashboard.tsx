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
        console.log("🔹 Fetching venues for manager:", user.name);
        const response = await fetchData(`/profiles/${user.name}/venues`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        console.log("✅ Venues loaded:", response.data);
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

  return (
    <div className="container mt-5">
      <h1 className="text-center">Venue Management</h1>

      {/* 🔹 Create Venue Button (Always Visible) */}
      <div className="text-center my-4">
        <Link to="/admin/create-venue" className="btn btn-success">
          + Create New Venue
        </Link>
      </div>

      {error && <p className="alert alert-danger text-center">{error}</p>}

      {/* 🔹 Loading State */}
      {loading && <p className="text-center">Loading venues...</p>}

      {/* 🔹 No Venues Found */}
      {!loading && venues.length === 0 && (
        <p className="text-center">You have no venues yet.</p>
      )}

      {/* 🔹 Managed Venues List */}
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
                  <button className="btn btn-sm btn-danger">Delete</button>
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
