import { Link } from "react-router-dom";

interface ProfileCardProps {
  profile: {
    name: string;
    email: string;
    bio?: string;
    avatar?: { url: string; alt?: string };
  };
  onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLogout }) => {
  return (
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
        <button onClick={onLogout} className="btn btn-danger w-100">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
