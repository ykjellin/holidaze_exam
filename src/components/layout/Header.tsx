import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, token, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
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
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link
          className="navbar-brand holidaze-logo"
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Holidaze
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav flex-column align-items-center w-100">
            <li className="nav-item">
              <Link
                className="nav-link my-2"
                to="/venues"
                onClick={() => setMenuOpen(false)}
              >
                Venues
              </Link>
            </li>

            {token && user?.venueManager && (
              <li className="nav-item">
                <Link
                  className="nav-link my-2 fw-bold text-success"
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {token && user ? (
              <li className="nav-item dropdown my-2">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
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
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-primary my-2"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
