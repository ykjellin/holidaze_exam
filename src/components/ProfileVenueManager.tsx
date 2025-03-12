import { fetchData } from "../api/api";

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
  if (!profile.email.endsWith("@stud.noroff.no") || profile.venueManager) {
    return null;
  }

  const handleRegisterAsVenueManager = async () => {
    if (!token || !apiKey) {
      return;
    }

    try {
      await fetchData(
        `/profiles/${profile.name}`,
        {
          method: "PUT",
          body: JSON.stringify({ venueManager: true }),
        },
        true,
        true
      );
    } catch (error) {
      console.error("❌ Failed to register as Venue Manager:", error);
    }
  };

  return (
    <div className="mt-4 text-center">
      <h2>Become a Venue Manager</h2>
      <p>As a venue manager, you can create and manage your own venues.</p>
      <button
        className="btn btn-success"
        onClick={handleRegisterAsVenueManager}
      >
        Register as Venue Manager
      </button>
    </div>
  );
};

export default ProfileVenueManager;
