import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { login, logout, setAuthStatus } from "./redux/authSlice";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes for routing

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ServiceManagement from "./components/ServiceManagement";
import TimeslotManagement from "./components/TimeslotManagement";
import AppointmentOverview from "./components/AppointmentOverview"; // Import AppointmentOverview
import Navbar from "./components/Navbar";
import "./App.css";
import LocationManagement from "./components/LocationManagement";
import DateManagement from "./components/DateManagement";
import TimeSelectionForm from "./components/TimeSelection";
import Profile from "./components/Profile"; // Import Profile component

import logo from "./assets/images/logo.png"


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      dispatch(setAuthStatus({ isAuthenticated: true, username: storedUsername }));
    }
  }, [dispatch]);

  const handleLogin = (username) => {
    localStorage.setItem("username", username);
    dispatch(login(username));
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    dispatch(logout());
  };

  const handleSignUp = (username, password) => {
    console.log("User signed up:", username, password);
    localStorage.setItem("username", username);
    dispatch(login(username));
    setIsSignUp(false);
  };

  return (
    <div className="app-container">
      <Router>
        {isAuthenticated ? (
          <>
            <Navbar onLogout={handleLogout} />


            {/* <header className="app-header">
              <h1>Professional Dashboard</h1>
              <p className="app-subheader">
                Manage your services, timeslots, and appointments effortlessly.
              </p>
            </header> */}
<header className="app-header">
  <div className="logo-container">
    <img src={logo} alt="App Logo" className="app-logo" />
  </div>
  <div className="header-text">
    <h1>Professional Dashboard</h1>
    <p className="app-subheader">
      Manage your services, timeslots, and appointments effortlessly.
    </p>
  </div>
</header>


            <main className="dashboard">
              <Routes>
                {/* Route for /appointments */}
                <Route path="/appointments" element={<AppointmentOverview />} />
                <Route path="/profile" element={<Profile />} /> {/* Add route for Profile */}

                {/* Route for the main dashboard */}
                <Route
                  path="/"
                  element={
                    <>
                      <ServiceManagement />
                      <LocationManagement />
                      <DateManagement />
                      <TimeSelectionForm />
                    </>
                  }
                />
              </Routes>
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
      </Router>
    </div>
  );
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
