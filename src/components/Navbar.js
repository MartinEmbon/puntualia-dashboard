// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for making the API request

import { Link } from "react-router-dom"; // Import Link for navigation
import "./Navbar.css";

function Navbar({ onLogout }) {
  // const publicUrl = businessSlug ? `/${businessSlug}` : "/"; // Default to home if no businessSlug
  // const publicUrl = `https://puntualia.vercel.app/${businessSlug}`;
  const [businessSlug, setBusinessSlug] = useState(null); // State to store the business slug

  // Fetch business slug when the component mounts
  useEffect(() => {
    const fetchBusinessSlug = async () => {
      try {
        const username = localStorage.getItem("username"); // Get username from localStorage
        
        // Check if username exists before making the request
        if (username) {
          // Replace with the correct API URL
          const response = await axios.get("https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-retrieve-slug", {
            params: { username: username }
          });

          if (response.status === 200 && response.data.businessSlug) {
            setBusinessSlug(response.data.businessSlug); // Store the businessSlug in state
          }
        } else {
          console.error("Username is not found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching business slug:", error);
      }
    };

    fetchBusinessSlug(); // Call the function to fetch business slug
  }, []); // Empty dependency array ensures this runs once on component mount

  // Set the public URL based on the businessSlug
  // const publicUrl = businessSlug ? `https://puntualia.vercel.app/${businessSlug}` : "/";  // Default to home if no businessSlug
  const publicUrl = businessSlug
  ? `https://puntualia.vercel.app/?slug=${businessSlug}`
  : "/";

  const username = localStorage.getItem("username"); // Get the username from localStorage


//llamar api de get business slug

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Button to navigate to Home ("/") */}
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>

        {/* Button to navigate to Upcoming Appointments */}
        <Link to="/appointments">
          <button className="appointments-button">Upcoming Appointments</button>
        </Link>
     
      
      <Link to="/profile">
          <button className="profile-button">Profile</button> {/* Add Profile button */}
        </Link>
        </div>

       {/* Business public URL */}
       <div className="business-url">
        <span>Public URL: </span>
        <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a>
      </div>


      {/* Logout button aligned to the right */}
      <div className="navbar-right">

        {/* Welcome message */}
        {username && <span className="welcome-message">Welcome, {username}</span>}
        
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
