import React, { useState } from "react";
import { Provider } from "react-redux";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ServiceManagement from "./components/ServiceManagement";
import TimeslotManagement from "./components/TimeslotManagement";
import AppointmentOverview from "./components/AppointmentOverview";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Track if the user is signing up or logging in

  const handleLogin = (username) => {
    // Store username in localStorage after successful login
    localStorage.setItem("username", username); // Store username in localStorage
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Remove username from localStorage on logout
    localStorage.removeItem("username");
    setIsAuthenticated(false);
  };

  const handleSignUp = (username, password) => {
    // Handle sign up logic (e.g., store user in a database or mock storage)
    console.log("User signed up:", username, password);
    setIsAuthenticated(true);
  };

  return (
  
   <div className="app-container">
      {isAuthenticated ? (
        <>
          <Navbar onLogout={handleLogout} />
          <header className="app-header">
            <h1>Professional Dashboard</h1>
            <p className="app-subheader">
              Manage your services, timeslots, and appointments effortlessly.
            </p>
          </header>
          <main className="dashboard">
            <ServiceManagement />
            <TimeslotManagement />
            <AppointmentOverview />
          </main>
          <footer className="app-footer">
            <p>&copy; 2024 Your Business Name. All rights reserved.</p>
          </footer>
        </>
      ) : isSignUp ? (
        <SignUp onSignUp={handleSignUp} setIsSignUp={setIsSignUp} />
      ) : (
        <Login onLogin={handleLogin} setIsSignUp={setIsSignUp} />
      )}
    </div>

  );
}

export default App;
