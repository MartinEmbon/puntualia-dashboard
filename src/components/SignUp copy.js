import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

function SignUp({ onSignUp, setIsSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  // Make sure to make this function async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error state before making the request

    try {
      // Make a POST request to the Cloud Function using axios
      const response = await axios.post("https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-create-user", {
        username,
        password,
        company
      });

      // Handle the response
      if (response.status === 201) {
        // Call the onSignUp function (if you have additional steps)
        onSignUp(username, password, company);

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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
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
