import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { register } from "../store/slices/authSlice";
import ErrorHandler from "./ErrorHandler";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    }
  };

  return (
    <div className="ah-auth-shell">
      <div className="ah-auth-card">
        <div className="ah-auth-card__brand">
          <span className="ah-navbar__logo">◆</span>
          <span>AdVantage</span>
        </div>
        <h2>Create an Account</h2>
        <p className="ah-auth-card__tagline">Register to get started on the platform.</p>

        <ErrorHandler error={error} />

        <form onSubmit={handleSubmit} className="ah-form">
          <label className="ah-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label className="ah-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="ah-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="ah-field">
            <span>I am a</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="CLIENT">CLIENT</option>
              <option value="AUDIENCE">AUDIENCE</option>
            </select>
          </label>

          <button type="submit" className="ah-btn ah-btn--primary ah-btn--block" disabled={loading}>
            Create Account
          </button>
        </form>

        <p className="ah-auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;