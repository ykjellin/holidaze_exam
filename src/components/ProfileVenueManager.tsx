import { fetchData } from "../api/api";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface VenueManagerProps {
  profile: {
    name: string;
    email: string;
    venueManager: boolean;
  };
  token: string | null;
  apiKey: string | null;
}

const ProfileVenueManager: React.FC<VenueManagerProps> = ({
  profile,
  token,
  apiKey,
}) => {
  const { updateUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!profile.email.endsWith("@stud.noroff.no")) {
    return null;
  }

  const toggleVenueManager = async () => {
    if (!token || !apiKey) {
      return;
    }

    setIsUpdating(true);

    try {
      const newStatus = !profile.venueManager;

      await fetchData(
        `/profiles/${profile.name}`,
        {
          method: "PUT",
          body: JSON.stringify({ venueManager: newStatus }),
        },
        true,
        true
      );

      updateUserProfile({ venueManager: newStatus });
    } catch (error) {
      console.error("❌ Failed to update Venue Manager status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <h2>Venue Manager Status</h2>
      <p>
        You are currently{" "}
        <strong>{profile.venueManager ? "a" : "not a"}</strong> venue manager.
      </p>
      <button
        className={`btn ${profile.venueManager ? "btn-danger" : "btn-success"}`}
        onClick={toggleVenueManager}
        disabled={isUpdating}
      >
        {isUpdating
          ? "Updating..."
          : profile.venueManager
          ? "Revoke Venue Manager"
          : "Become a Venue Manager"}
      </button>
    </div>
  );
};

export default ProfileVenueManager;
