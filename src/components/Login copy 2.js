import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios"; // Import axios
import { login } from "../redux/authSlice"; // Redux login action
import "./Login.css";

function Login({ setIsSignUp }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Error state to display error messages
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors before starting the login request

    try {
      // Make a POST request using Axios to log in
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-user-login",
        credentials
      );

      // Check for successful login response
      if (response.status === 200) {
        const { data } = response;

        // Assuming the API returns the username upon successful login
        if (data.username) {
          // Dispatch login action to update Redux state
          dispatch(login({ username: data.username }));

          // Store the username in localStorage for persistence
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("username", data.username);

          // Show success message (optional)
          alert("Login successful!");

          // Optionally, navigate to the dashboard or set additional state for logged-in users
          // e.g., redirect to the dashboard (can be done later when using React Router)
        } else {
          setError("Invalid username or password.");
        }
      }
    } catch (error) {
      // Handle the error case
      if (error.response) {
        // The server responded with an error
        setError(error.response.data.message || "Invalid login credentials.");
      } else {
        // No response from the server (network error, etc.)
        setError("Failed to connect to the server.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Dashboard</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      <p>
        Don't have an account?{" "}
        <button onClick={() => setIsSignUp(true)}>Sign Up</button>
      </p>
    </div>
  );
}

export default Login;
