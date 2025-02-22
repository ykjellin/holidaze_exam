import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { Link } from "react-router-dom";
import "../styles/pages/_home.scss";

interface Venue {
  id: string;
  name: string;
  media: { url: string; alt: string }[];
}

const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextIndex, setNextIndex] = useState(3);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await fetchData("/venues");
        setVenues(response.data || []);
        setDisplayedVenues(response.data.slice(0, 3));
      } catch (err) {
        console.error("❌ Failed to fetch venues:", err);
        setError("Could not load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  const fetchNextVenue = async () => {
    if (nextIndex >= venues.length) {
      setNextIndex(0);
      return;
    }

    try {
      const nextVenue = venues[nextIndex];
      setDisplayedVenues((prevVenues) => [...prevVenues.slice(1), nextVenue]);
      setNextIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error("❌ Error fetching new venue:", err);
      setError("Could not load new venue.");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to Holidaze</h1>
      <p className="lead">
        Find and book the perfect venue for your next holiday or event.
      </p>

      <Link to="/venues" className="btn my-3 action-btn">
        Browse Venues
      </Link>

      {loading && <p>Loading venues...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && displayedVenues.length === 3 && (
        <div id="venueCarousel" className="carousel slide">
          <div className="carousel-inner">
            {displayedVenues.map((venue, index) => (
              <Link
                to={`/venues/${venue.id}`}
                key={venue.id}
                className="position-relative mx-2"
              >
                <img
                  src={venue.media[0]?.url || "https://placehold.co/300x200"}
                  className={`carousel-img ${
                    index === 1 ? "active-img" : "inactive-img"
                  }`}
                  alt={venue.media[0]?.alt || venue.name}
                />
                <div className="venue-name-overlay">{venue.name}</div>
              </Link>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            onClick={() => fetchNextVenue()}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>

          <button
            className="carousel-control-next"
            onClick={() => fetchNextVenue()}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
