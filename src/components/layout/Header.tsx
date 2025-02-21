import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, token, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand holidaze-logo" to="/">
          Holidaze
        </Link>

        <div className="d-flex align-items-center">
          <Link className="nav-link mx-3" to="/venues">
            Venues
          </Link>

          {token && user?.venueManager && (
            <Link
              className="nav-link mx-3 fw-bold text-success"
              to="admin/dashboard"
            >
              Dashboard
            </Link>
          )}

          {token && user ? (
            <div className="dropdown position-relative" ref={dropdownRef}>
              <button
                className="btn btn-link dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                data-bs-toggle="dropdown"
              >
                <img
                  src={user.avatar?.url || "https://placehold.co/40"}
                  alt={user.avatar?.alt || "Profile"}
                  className="rounded-circle"
                  width={40}
                  height={40}
                />
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end ${
                  dropdownOpen ? "show" : ""
                }`}
              >
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => logout()}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-primary ms-3" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
