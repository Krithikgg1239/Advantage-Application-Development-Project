import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="ah-navbar">
      <div className="ah-navbar__brand" onClick={() => navigate(user ? "/" : "/home")} style={{ cursor: "pointer" }}>
        <span className="ah-navbar__logo">◆</span>
        <span>AdVantage</span>
      </div>

      <div className="ah-navbar__links">
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          Home
        </Link>

        {user && (
          <Link to="/" className={isActive("/") ? "active" : ""}>
            {user.role === "AUDIENCE" ? "Audience Portal" : "Dashboard"}
          </Link>
        )}

        {user && (user.role === "ADMANAGER" || user.role === "CLIENT") && (
          <Link to="/campaigns" className={isActive("/campaigns") ? "active" : ""}>
            Campaigns
          </Link>
        )}

        {user && (
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            Profile
          </Link>
        )}
      </div>

      <div className="ah-navbar__user">
        {user ? (
          <>
            <Link to="/profile" className="ah-navbar__profile-trigger" title="View Profile">
              <div className="ah-navbar__avatar-pill">
                <span className="ah-navbar__avatar-char">
                  {(user.username || "U").charAt(0).toUpperCase()}
                </span>
                <div className="ah-navbar__identity">
                  <span className="ah-navbar__username">{user.username}</span>
                  <span className={`ah-navbar__role ah-navbar__role--${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </Link>

            <button
              type="button"
              title="Logout"
              className="ah-navbar__logout"
              onClick={handleLogout}
            >
              ⎋
            </button>
          </>
        ) : (
          <div className="ah-navbar__guest-actions">
            <Link to="/login" className="ah-btn ah-btn--xs ah-btn--ghost">
              Sign In
            </Link>
            <Link to="/register" className="ah-btn ah-btn--xs ah-btn--primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;