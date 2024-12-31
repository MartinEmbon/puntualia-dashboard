import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DateManagement.css";

const DaySelectionForm = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedDays, setSavedDays] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [services, setServices] = useState([]);

    // Fetch services
    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await axios.get(
            `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-services?username=${username}`
          );
          if (Array.isArray(response.data)) {
            setServices(response.data);
          }
        } catch (err) {
          console.error("Error fetching services:", err);
        }
      };
      fetchServices();
    }, [username]);

  const handleCheckboxChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleUnselectAll = () => {
    setSelectedDays([]);
  };

  const handleSubmit = async () => {
    if (!username) {
      alert("Please log in to submit your selected days.");
      return;
    }

    try {
      console.log("Sending data:", { username, selectedDays });

      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-date-management",
        { username, days: selectedDays }
      );

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
          setSavedDays(response.data.days);
          setSelectedDays(response.data.days);
        } else {
          setSavedDays([]);
          setSelectedDays([]);
        }
      } catch (err) {
        console.error("Error fetching saved days:", err);
        setError("Failed to fetch saved days.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDays();
  }, [username]);

  const isUpdate = selectedDays.length > 0 && selectedDays.join(",") !== savedDays.join(",");

  return (
    <div className="date-management">
      <h2>Select Available Days</h2>
      <div className="day-selection-form">
        <label className="checkbox-label">
          <input
            type="checkbox"
            onChange={() => handleUnselectAll()}
            checked={selectedDays.length === 0}
          />
          Unselect All
        </label>

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

        <button onClick={handleSubmit}>
          {isUpdate ? "Update Days" : "Save Days"}
        </button>

        {loading && <p className="loading-text">Loading saved days...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="selected-days">
          {selectedDays.length > 0 ? (
            selectedDays.map((day) => (
              <span key={day} className="day-tag">
                {day}
              </span>
            ))
          ) : (
            <p className="no-days-selected">No days selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySelectionForm;
