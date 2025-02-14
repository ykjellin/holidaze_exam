import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { Link } from "react-router-dom";

interface Venue {
  id: string;
  name: string;
  description?: string;
  media: { url: string; alt: string }[];
}

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await fetchData("/venues");
        setVenues(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch venues:", err);
        setError("Could not load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Browse Venues</h1>
      <p className="text-center lead">
        Discover amazing venues for your next holiday.
      </p>

      {loading && <p>Loading venues...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && venues.length > 0 && (
        <div className="row">
          {venues.map((venue) => (
            <div className="col-md-4 mb-4" key={venue.id}>
              <div className="card">
                <img
                  src={venue.media[0]?.url || "https://placehold.co/300x200"}
                  className="card-img-top"
                  alt={venue.media[0]?.alt || venue.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{venue.name}</h5>
                  <p className="card-text">
                    {venue.description
                      ? venue.description.substring(0, 100) + "..."
                      : "No description available."}
                  </p>
                  <Link to={`/venues/${venue.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Venues;
