import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimeManagement.css";

const TimeSelectionForm = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [unselectAllChecked, setUnselectAllChecked] = useState(false); // Track "Unselect All" checkbox state
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedTimes, setSavedTimes] = useState([]);

  const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? "0" : ""}${i}:00`);
  const halfHours = hours.map((hour) => [`${hour}`, `${hour.slice(0, 2)}:30`]).flat();

  const handleCheckboxChange = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // Handle "Unselect All" checkbox toggle
  const handleUnselectAll = (e) => {
    if (e.target.checked) {
      setSelectedTimes([]); // Clear all selected times immediately
    }
    setUnselectAllChecked(e.target.checked); // Update the state of "Unselect All" checkbox
  };

  useEffect(() => {
    // Automatically uncheck "Unselect All" when a time is selected
    if (selectedTimes.length > 0) {
      setUnselectAllChecked(false); // Uncheck "Unselect All" checkbox
    }
  }, [selectedTimes]);

  const handleSubmit = async () => {
    if (!username) {
      alert("Please log in to submit your selected times.");
      return;
    }

    try {
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot",
        { username, times: selectedTimes }
      );

      if (response.status === 200) {
        alert("Times saved successfully!");
        setSavedTimes(selectedTimes);
      } else {
        alert("Failed to save times.");
      }
    } catch (error) {
      console.error("Error submitting times:", error);
      alert("Error saving times, please try again.");
    }
  };

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
          setSavedTimes(response.data.times);
          setSelectedTimes(response.data.times);
        } else {
          setSavedTimes([]);
          setSelectedTimes([]);
        }
      } catch (err) {
        console.error("Error fetching saved times:", err);
        setError("No times selected.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTimes();
  }, [username]);

  const isUpdate = selectedTimes.length > 0 && selectedTimes.join(",") !== savedTimes.join(",");

  return (
    <div className="time-management">
      <h2>Select Available Times</h2>
      <div className="time-selection-form">
        <label className="checkbox-label checkbox-unselect">
          <input
            type="checkbox"
            checked={unselectAllChecked} // Bind to state
            onChange={handleUnselectAll}
          />
          Unselect All
        </label>

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

        {loading && <p>Loading saved times...</p>}
        {error && <p>{error}</p>}

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
