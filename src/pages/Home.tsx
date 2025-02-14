import { useEffect, useState } from "react";
import { fetchData } from "../api/api";

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
      console.log("🔹 No more venues to fetch, resetting...");
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
              <img
                src={
                  displayedVenues[0]?.media[0]?.url ||
                  "https://placehold.co/300x200"
                }
                className="carousel-img prev mx-2"
                alt={displayedVenues[0]?.media[0]?.alt || "Previous Venue"}
                style={{ maxWidth: "300px", height: "auto", opacity: "0.6" }}
              />

              <img
                src={
                  displayedVenues[1]?.media[0]?.url ||
                  "https://placehold.co/600x400"
                }
                className="carousel-img active-img mx-2"
                alt={displayedVenues[1]?.media[0]?.alt || "Current Venue"}
                style={{
                  maxWidth: "600px",
                  height: "auto",
                  border: "3px solid white",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              />

              <img
                src={
                  displayedVenues[2]?.media[0]?.url ||
                  "https://placehold.co/300x200"
                }
                className="carousel-img next mx-2"
                alt={displayedVenues[2]?.media[0]?.alt || "Next Venue"}
                style={{ maxWidth: "300px", height: "auto", opacity: "0.6" }}
              />
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
