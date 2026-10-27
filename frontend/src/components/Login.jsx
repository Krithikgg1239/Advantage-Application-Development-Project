import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import ErrorHandler from "./ErrorHandler";
import toast from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Welcome back, ${username}!`);
      navigate("/");
    }
  };

  return (
    <div className="ah-auth-shell">
      <div className="ah-auth-card">
        <div className="ah-auth-card__brand">
          <span className="ah-navbar__logo">◆</span>
          <span>AdVantage</span>
        </div>
        <h2>Sign In to Your Account</h2>
        <p className="ah-auth-card__tagline">
          Enter your username and password to access your workspace.
        </p>

        <ErrorHandler error={error} />

        <form onSubmit={handleSubmit} className="ah-form">
          <label className="ah-field" htmlFor="login-username">
            <span>Username</span>
            <input
              id="login-username"
              type="text"
              name="username"
              aria-label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="ah-field" htmlFor="login-password">
            <span>Password</span>
            <input
              id="login-password"
              type="password"
              name="password"
              aria-label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="ah-btn ah-btn--primary ah-btn--block ah-btn--glow"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In to Workspace →"}
          </button>
        </form>

        <p className="ah-auth-card__footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link> &bull;{" "}
          <Link to="/home">Explore Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;