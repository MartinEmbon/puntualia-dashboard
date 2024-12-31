import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DateManagement.css";

const DaySelectionForm = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username")); // Get username from localStorage
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [savedDays, setSavedDays] = useState([]); // To store the previously fetched days

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle checkbox changes to add/remove selected days
  const handleCheckboxChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!username) {
      alert('Please log in to submit your selected days.');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day.');
      return;
    }

    try {
      console.log("Sending data:", { username, selectedDays });

      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-date-management", // Replace with your actual Cloud Function URL
        { username, days: selectedDays } // Send the username and selected days
      );

      console.log("Response:", response);

      if (response.status === 200) {
        alert("Days saved successfully!");
      } else {
        alert("Failed to save days.");
      }
    } catch (error) {
      console.error("Error submitting days:", error);
      alert("Error saving days, please try again.");
    }
  };

  // Fetch the saved days when the component mounts
  useEffect(() => {
    const fetchSavedDays = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-dates?username=${username}`
        );
        
        if (response.status === 200 && response.data.days) {
            setSavedDays(response.data.days); // Store the saved days

            setSelectedDays(response.data.days); // Set the retrieved days
        } else {
            setSavedDays([]); // No days found, reset to empty

            setSelectedDays([]); // No days found, reset to empty
        }
      } catch (err) {
        console.error("Error fetching saved days:", err);
        setError("Failed to fetch saved days.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDays();
  }, [username]); // Run effect when username changes or component mounts
  const isUpdate = selectedDays.length > 0 && selectedDays.join(",") !== savedDays.join(",");

  return (
    <div className="date-management">
      <h2>Select Available Days</h2>
      <div className="day-selection-form">
    
        
        {/* Checkbox selection for days */}
        {daysOfWeek.map((day) => (
          <label key={day} className="checkbox-label">
            <input
              type="checkbox"
              value={day}
              checked={selectedDays.includes(day)}
              onChange={() => handleCheckboxChange(day)}
            />
            {day}
          </label>
        ))}

        <button onClick={handleSubmit}>          {isUpdate ? "Update Days" : "Save Days"}
        </button>

        {/* Display loading state, error, or selected days */}
        {loading && <p>Loading saved days...</p>}
        {error && <p>{error}</p>}

        {/* Display the selected days */}
        <div className="selected-days">
          {selectedDays.length > 0 ? (
            selectedDays.map((day) => (
              <span key={day} className="day-tag">{day}</span>
            ))
          ) : (
            <p>No days selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySelectionForm;
