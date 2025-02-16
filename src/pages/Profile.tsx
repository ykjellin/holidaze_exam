import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/auth";

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  venueManager: boolean;
}

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

const Profile = () => {
  const { token, apiKey, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!token || !apiKey || !user?.name) {
      console.warn("⚠️ Missing authentication. Redirecting to login...");
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetchData(`/profiles/${user.name}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey ?? "",
          },
        });

        console.log("✅ Profile Loaded:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, token, apiKey, navigate]);

  useEffect(() => {
    if (!profile?.name) return;

    const loadBookings = async () => {
      try {
        const response = await fetchData(
          `/profiles/${profile.name}/bookings?_venue=true`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey ?? "",
            },
          }
        );

        setBookings(response.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      }
    };

    loadBookings();
  }, [profile, token, apiKey]);

  const handleRegisterAsVenueManager = async () => {
    if (!profile || !user?.name || !token || !apiKey) {
      console.error("❌ Missing required credentials for updating profile.");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔹 Registering as Venue Manager for:", user.name);

      const updatedProfile = await updateProfile(token, apiKey, user.name);

      setProfile(updatedProfile);
      console.log("✅ Successfully registered as Venue Manager");
    } catch (err) {
      console.error("❌ Failed to register as Venue Manager:", err);
      setError("Failed to register as Venue Manager.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      {loading && <p>Loading profile...</p>}
      {error && <p className="alert alert-danger text-center">{error}</p>}

      {profile && (
        <div className="card mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body text-center">
            <img
              src={profile.avatar?.url || "https://placehold.co/150"}
              alt={profile.avatar?.alt || "User Avatar"}
              className="rounded-circle mb-3"
              width={150}
              height={150}
            />
            <h5 className="card-title">{profile.name}</h5>
            <p className="card-text">{profile.email}</p>
            <p className="card-text">{profile.bio || "No bio available."}</p>
            <Link to="/edit-profile" className="btn btn-primary w-100 mb-2">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-danger w-100">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Venue Manager Section */}
      {profile?.email.endsWith("@stud.noroff.no") && !profile.venueManager && (
        <div className="mt-4 text-center">
          <h2>Become a Venue Manager</h2>
          <p>As a venue manager, you can create and manage your own venues.</p>
          <button
            className="btn btn-success"
            onClick={handleRegisterAsVenueManager}
            disabled={isUpdating}
          >
            {isUpdating ? "Registering..." : "Register as Venue Manager"}
          </button>
        </div>
      )}

      {profile?.venueManager && (
        <div className="mt-4 text-center">
          <h2>You are a Venue Manager</h2>
          <p>You can create and manage venues on Holidaze.</p>
        </div>
      )}

      {/* Upcoming Bookings */}
      <div className="mt-5">
        <h2 className="text-center">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-center">You have no upcoming bookings.</p>
        ) : (
          <div className="row">
            {bookings.map((booking) => {
              const venue = booking.venue || {
                id: "",
                name: "Unknown Venue",
                media: [],
              };
              const venueImage =
                venue.media?.[0]?.url || "https://placehold.co/300x200";

              return (
                <div className="col-md-4 mb-4" key={booking.id}>
                  <div className="card">
                    <img
                      src={venueImage}
                      className="card-img-top"
                      alt={venue.media?.[0]?.alt || `Booking ${booking.id}`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{venue.name}</h5>
                      <p className="card-text">
                        <strong>Check-in:</strong>{" "}
                        {new Date(booking.dateFrom).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <strong>Check-out:</strong>{" "}
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </p>
                      {venue.id ? (
                        <Link
                          to={`/venues/${venue.id}`}
                          className="btn btn-primary"
                        >
                          View Venue
                        </Link>
                      ) : (
                        <span className="btn btn-secondary disabled">
                          Venue Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
