import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return "All fields are required.";
    }
    if (!email.endsWith("@stud.noroff.no")) {
      return "You must use a @stud.noroff.no email.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await registerUser(name, email, password);
      console.log("✅ Registration Successful:", response);
      setSuccess(true);

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("❌ Registration Error:", err);
      setError(
        err instanceof Error ? err.message : "Unknown registration error"
      );

      if (
        err instanceof Error &&
        err.message.includes("Profile already exists")
      ) {
        setError("This email is already registered. Try logging in instead.");
      } else {
        setError(
          err instanceof Error ? err.message : "Unknown registration error"
        );
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Register</h1>
      <form
        onSubmit={handleRegister}
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        {error && <p className="alert alert-danger text-center">{error}</p>}
        {success && (
          <p className="alert alert-success text-center">
            ✅ Registration Successful! Redirecting...
          </p>
        )}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
