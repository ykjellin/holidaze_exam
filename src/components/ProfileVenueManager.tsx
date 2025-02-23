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
    try {
      const response = await fetch(`/profiles/${profile.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey ?? "",
        },
        body: JSON.stringify({ venueManager: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to register as venue manager.");
      }
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
