import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import ProfileCard from "../components/ProfileCard";
import ProfileVenueManager from "../components/ProfileVenueManager";
import ProfileBookingsList from "../components/ProfileBookingsList";

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  venueManager: boolean;
}

const Profile = () => {
  const { user, token, apiKey } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

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
            Authorization: `Bearer ${token as string}`,
            "X-Noroff-API-Key": apiKey as string,
          },
        });

        setProfile(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        setError("Failed to load profile.");
      }
    };

    loadProfile();
  }, [user, token, apiKey, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      {error && <p className="alert alert-danger text-center">{error}</p>}

      {profile && (
        <>
          {/* Profile Card Component */}
          <ProfileCard profile={profile} onLogout={handleLogout} />

          {/* Venue Manager Section */}
          <ProfileVenueManager
            profile={profile}
            token={token}
            apiKey={apiKey}
          />

          {/* Bookings Section */}
          <ProfileBookingsList
            profile={profile}
            token={token}
            apiKey={apiKey}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
