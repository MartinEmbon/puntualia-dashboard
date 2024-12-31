import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios"; // Import axios
import { login } from "../redux/authSlice"; // Redux login action
import "./Login.css";
import logo from "../assets/images/logo.png"; // Import logo image

function Login({ setIsSignUp }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Error state to display error messages
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle password recovery view
  const [email, setEmail] = useState(""); // State to capture the email in forgot password form
  const dispatch = useDispatch();

  const handleLoginSubmit = async (e) => {
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
          // alert("Login successful!");

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Make a POST request to send the email for password recovery
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-reset-password",
        { email }
      );

      if (response.status === 200) {
        alert("Password reset instructions have been sent to your email.");
        setIsForgotPassword(false); // Hide the forgot password form after submission
      } else {
        setError("Error sending password reset instructions.");
      }
    } catch (error) {
      setError("Failed to send reset instructions.");
    }
  };

  return (
    <div className="login-container">
    <header className="login-header">
<div className="logo-container">
          <img src={logo} alt="App Logo" className="app-logo" />
        </div>

      <h2>Login to Your Dashboard</h2>
      </header>
      <form onSubmit={handleLoginSubmit} className="login-form">
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

      {!isForgotPassword ? (
        <p>
          
          <a href="#" onClick={() => setIsForgotPassword(true)} className="forgot-password-link">
          Forgot your password? 
          </a>
        </p>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit} className="forgot-password-form">
          <p>Enter your email to receive password reset instructions.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setIsForgotPassword(false)}>
            Cancel
          </button>
        </form>
      )}

      <p>
        Don't have an account? {" "}
        <button onClick={() => setIsSignUp(true)}>Sign Up</button>
      </p>
    </div>
  );
}

export default Login;
