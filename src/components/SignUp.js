import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import logo from "../assets/images/logo.png"; // Import logo image

function SignUp({ onSignUp, setIsSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // Email field
  const [fullName, setFullName] = useState(""); // Full Name field
  const [error, setError] = useState("");

  // Function to generate a random string (e.g., using Date.now() for uniqueness)
  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 10); // generates a random string
  };

  // Function to generate the businessSlug with random string for uniqueness
  const generateBusinessSlug = () => {
    const randomString = generateRandomString();
    return `${company}-${city}-${randomString}`.toLowerCase().replace(/\s+/g, '-');
  };

  // Make sure to make this function async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before making the request

    const businessSlug = generateBusinessSlug(); // Generate businessSlug

    try {
      // Make a POST request to the Cloud Function using axios
      const response = await axios.post("https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-create-user", {
        username,
        password,
        email, // Pass the email
        fullName, // Pass the full name
        company,
        city,
        address,
        phone,
        businessSlug
      });

      // Handle the response
      if (response.status === 201) {
        // Call the onSignUp function (if you have additional steps)
        onSignUp(username, password, company, businessSlug);

        // Optionally redirect or show a success message
        alert("User registered successfully!");
      } else {
        // Handle the error from the response
        setError(response.data.message || "An error occurred during sign-up.");
      }
    } catch (error) {
      // Handle network or other errors
      setError("Failed to connect to the server.");
      console.error(error); // Optionally log the error for debugging purposes
    }
  };

  return (
    <div className="signup-container">

        {/* Logo Header */}
        <div className="header">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <h2>Sign Up</h2>
      <p className="subheader">Create an account and get started with managing your business!</p> {/* Subheader */}

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}  // Bind to state
          onChange={(e) => setEmail(e.target.value)}  // Handle email change
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}  // New Full Name field
          onChange={(e) => setFullName(e.target.value)}  // Handle full name change
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => setIsSignUp(false)}>Login</button>
      </p>

      {error && <p className="error">{error}</p>} {/* Display any error messages */}
    </div>
  );
}

export default SignUp;
