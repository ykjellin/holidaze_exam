import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { Link } from "react-router-dom";

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
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadVenues = async () => {
      if (isFetching || isLastPage) return;
      setIsFetching(true);

      try {
        const response = await fetchData(
          `/venues?page=${page}&limit=100&_bookings=true`
        );

        if (!response || !response.data) {
          setError("Could not load venues. Please try again later.");
          return;
        }

        setVenues((prevVenues) => {
          const mergedVenues = [
            ...prevVenues,
            ...response.data.filter(
              (venue: Venue) => !prevVenues.some((v) => v.id === venue.id)
            ),
          ];
          return mergedVenues;
        });

        setIsLastPage(response.meta?.isLastPage ?? true);
        if (!response.meta?.isLastPage) {
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError("Could not load venues. Please try again later.");
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    };

    loadVenues();
  }, [page]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredVenues(venues);
    }
  }, [venues]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter((venue) =>
        venue.name.toLowerCase().includes(query)
      );
      setFilteredVenues(filtered);
    }
  };

  const sortedVenues = [...filteredVenues].sort((a, b) => {
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

      <div className="mb-4 d-flex flex-column flex-md-row align-items-start">
        <input
          type="text"
          className="form-control"
          placeholder="Search for a venue..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ maxWidth: "300px" }}
        />

        <select
          className="form-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ maxWidth: "200px" }}
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
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={venue.id}>
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
    </div>
  );
};

export default Venues;
