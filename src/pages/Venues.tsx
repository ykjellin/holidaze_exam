import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { Link } from "react-router-dom";
import "../styles/pages/_venues.scss";

interface Venue {
  id: string;
  name: string;
  description?: string;
  media?: { url: string; alt: string }[];
  created: string;
  bookingsCount?: number;
}

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    loadVenues(1);
  }, []);

  const loadVenues = async (newPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData(
        `/venues?page=${newPage}&limit=100&_bookings=true`
      );

      if (!response || !response.data) {
        setError("Could not load venues. Please try again later.");
        return;
      }

      setVenues(response.data);
      setPage(newPage);
      setIsLastPage(response.meta?.isLastPage ?? true);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Could not load venues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      loadVenues(1);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchData(`/venues/search?q=${query}&limit=100`);

      if (!response || !response.data) {
        setError("Could not fetch search results. Please try again.");
        return;
      }

      setVenues(response.data);
      setIsLastPage(true);
    } catch (err) {
      setError("An error occurred while searching for venues.");
    } finally {
      setLoading(false);
    }
  };

  const sortedVenues = [...venues].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case "oldest":
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      case "mostBooked":
        return (b.bookingsCount || 0) - (a.bookingsCount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center">Browse Venues</h1>
      <p className="text-center lead">
        Discover amazing venues for your next holiday.
      </p>

      <div className="mb-4 d-flex flex-column flex-md-row align-items-start search-filter-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search for a venue..."
          value={searchQuery}
          onChange={handleSearch}
        />

        <select
          className="form-select sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="mostBooked">Most Booked</option>
        </select>
      </div>

      {loading && <p>Loading venues...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && sortedVenues.length > 0 && (
        <div className="row">
          {sortedVenues.map((venue) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={venue.id}>
              <div className="card">
                <img
                  src={
                    venue.media?.length &&
                    venue.media[0]?.url?.startsWith("http")
                      ? venue.media[0].url
                      : "https://placehold.co/300x200"
                  }
                  className="card-img-top"
                  alt={venue.media?.[0]?.alt || venue.name}
                  onError={(e) => {
                    if (
                      e.currentTarget.src !== "https://placehold.co/300x200"
                    ) {
                      e.currentTarget.src = "https://placehold.co/300x200";
                    }
                  }}
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

      {!loading && !error && sortedVenues.length === 0 && (
        <p className="text-center">No venues match your search.</p>
      )}

      {!searchQuery && (
        <div className="text-center mt-4">
          <button
            className="btn btn-venue-page me-2"
            onClick={() => loadVenues(page - 1)}
            disabled={page === 1}
          >
            Previous Page
          </button>

          <button
            className="btn btn-venue-page"
            onClick={() => loadVenues(page + 1)}
            disabled={isLastPage}
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default Venues;
