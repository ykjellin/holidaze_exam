import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { Link } from "react-router-dom";

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
      // Fetch the next venue
      const nextVenue = venues[nextIndex];
      setDisplayedVenues((prevVenues) => [...prevVenues.slice(1), nextVenue]);
      setNextIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error("❌ Error fetching new venue:", err);
      setError("Could not load new venue.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to Holidaze</h1>
      <p className="lead">
        Find and book the perfect venue for your next holiday.
      </p>

      {loading && <p>Loading venues...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && displayedVenues.length === 3 && (
        <div id="venueCarousel" className="carousel slide">
          <div className="carousel-inner">
            <div className="d-flex justify-content-center align-items-center">
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
                    style={{
                      maxWidth: index === 1 ? "600px" : "300px",
                      height: "auto",
                      border: index === 1 ? "3px solid white" : "none",
                      boxShadow:
                        index === 1 ? "0px 4px 10px rgba(0,0,0,0.2)" : "none",
                      opacity: index === 1 ? "1" : "0.6",
                      position: "relative",
                    }}
                  />

                  <div
                    className="position-absolute w-100 text-center"
                    style={{
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      maxWidth: index === 1 ? "500px" : "250px",
                      fontSize: index === 1 ? "1.2rem" : "1rem",
                    }}
                  >
                    {venue.name}
                  </div>
                </Link>
              ))}
            </div>
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
