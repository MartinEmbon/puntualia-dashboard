import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimeManagement.css"; // Assuming you'll create specific styles for time selection

const TimeSelectionForm = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedTimes, setSavedTimes] = useState([]); // To store previously fetched time slots

  // Predefined hours for the day (00:00 to 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);
  const halfHours = hours.map(hour => [`${hour}`, `${hour.slice(0, 2)}:30`]).flat(); // Add half-hour intervals

  // Handle checkbox selection change
  const handleCheckboxChange = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!username) {
      alert('Please log in to submit your selected times.');
      return;
    }

    if (selectedTimes.length === 0) {
      alert('Please select at least one time.');
      return;
    }

    try {
      console.log("Sending data:", { username, selectedTimes });

      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot", // Replace with your actual Cloud Function URL
        { username, times: selectedTimes }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        alert("Times saved successfully!");
      } else {
        alert("Failed to save times.");
      }
    } catch (error) {
      console.error("Error submitting times:", error);
      alert("Error saving times, please try again.");
    }
  };

  // Fetch saved times when the component mounts
  useEffect(() => {
    const fetchSavedTimes = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot?username=${username}`
        );

        if (response.status === 200 && response.data.times) {
          setSavedTimes(response.data.times); // Store the saved times
          setSelectedTimes(response.data.times); // Set the selected times to the saved ones
        } else {
          setSavedTimes([]);
          setSelectedTimes([]);
        }
      } catch (err) {
        console.error("Error fetching saved times:", err);
        setError("Failed to fetch saved times.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTimes();
  }, [username]);

  // Determine if the button should say "Save Times" or "Update Times"
  const isUpdate = selectedTimes.length > 0 && selectedTimes.join(",") !== savedTimes.join(",");

  return (
    <div className="time-management">
      <h2>Select Available Times</h2>
      <div className="time-selection-form">
       

        {/* Scrollable checkbox container */}
        <div className="checkboxes-container">
          {halfHours.map((time) => (
            <label key={time} className="checkbox-label">
              <input
                type="checkbox"
                value={time}
                checked={selectedTimes.includes(time)}
                onChange={() => handleCheckboxChange(time)}
              />
              {time}
            </label>
          ))}
        </div>

        <button onClick={handleSubmit}>
          {isUpdate ? "Update Times" : "Save Times"}
        </button>

        {/* Display loading state, error, or selected times */}
        {loading && <p>Loading saved times...</p>}
        {error && <p>{error}</p>}

        {/* Display the selected times */}
        <div className="selected-times">
          {selectedTimes.length > 0 ? (
            selectedTimes.map((time) => (
              <span key={time} className="time-tag">{time}</span>
            ))
          ) : (
            <p>No times selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionForm;
