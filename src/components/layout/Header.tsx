import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, token, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

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
      <div className="container-fluid">
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
          <ul className="navbar-nav w-100 d-flex justify-content-center">
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
                  className="nav-link my-2"
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {token && user ? (
            <>
              <ul className="navbar-nav ms-auto">
                <li
                  className="nav-item dropdown d-none d-lg-block"
                  ref={dropdownRef}
                >
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
                    data-bs-popper="static"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>

              <li className="d-lg-none w-100 profile-section">
                <hr className="profile-divider" />
                <div className="text-center profile-text">Account</div>
                <Link
                  className="nav-link profile-link"
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="nav-link profile-link logout-btn"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <Link
              className="btn login-btn my-2"
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
