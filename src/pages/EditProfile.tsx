import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/auth";

const EditProfile = () => {
  const { user, token, apiKey } = useAuth();
  const navigate = useNavigate();
  const [newAvatar, setNewAvatar] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user?.name || !token || !apiKey) {
      console.error("❌ Missing required credentials for updating profile.");
      setError("Missing authentication credentials.");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔹 Updating Profile for:", user.name);

      const updates: { avatarUrl?: string; bio?: string } = {};
      if (newAvatar.trim()) {
        updates.avatarUrl = newAvatar.trim();
      }
      if (newBio.trim()) {
        updates.bio = newBio.trim();
      }

      console.log("📌 Sending Updates:", updates);

      const updatedProfile = await updateProfile(
        token,
        apiKey,
        user.name,
        updates
      );

      console.log("✅ Profile Updated Successfully:", updatedProfile);

      navigate("/profile");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setError("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Edit Profile</h2>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">New Avatar URL</label>
            <input
              type="text"
              className="form-control"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              placeholder="Enter new avatar URL"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Bio</label>
            <textarea
              className="form-control"
              rows={3}
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Enter new bio"
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleProfileUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
