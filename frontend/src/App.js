import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CampaignList from "./components/campaign/CampaignList";
import Profile from "./components/profile/Profile";
import CredentialsFooter from "./components/common/CredentialsFooter";
import "./App.css";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <main className="ah-main">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              user ? (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;