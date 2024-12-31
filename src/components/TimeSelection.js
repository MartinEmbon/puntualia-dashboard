import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimeManagement.css";

const TimeSelectionForm = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const [savedTimes, setSavedTimes] = useState([]);

  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
    "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
    "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
    "12:00 AM"
  ];

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

  // Fetch saved times for selected service
  useEffect(() => {
    const fetchSavedTimes = async () => {
      if (!username || !selectedService) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot?username=${username}&serviceId=${selectedService}`
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
        setError("Failed to fetch saved times.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTimes();
  }, [username, selectedService]);

  const handleSelectAll = () => {
    setSelectedTimes(timeSlots);
  };

  const handleUnselectAll = () => {
    setSelectedTimes([]);
  };

  const handleCheckboxChange = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    if (!username || !selectedService) {
      alert("Please select a service and log in to submit your selected times.");
      return;
    }

    try {
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot",
        { username, serviceId: selectedService, times: selectedTimes }
      );

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

  return (
    <div className="time-selection">
      <h2>Available Times</h2>
      <select
        onChange={(e) => setSelectedService(e.target.value)}
        value={selectedService || ""}
      >
        <option value="" disabled>
          Select a Service
        </option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      {selectedService && (
        <>
          <div className="time-selection-form">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={() =>
                  selectedTimes.length === timeSlots.length
                    ? handleUnselectAll()
                    : handleSelectAll()
                }
                checked={selectedTimes.length === timeSlots.length}
              />
              Select All
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={handleUnselectAll}
                checked={selectedTimes.length === 0}
              />
              Unselect All
            </label>
            {timeSlots.map((time) => (
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

          <div className="selected-times">
            {selectedTimes.length > 0 ? (
              selectedTimes.map((time) => (
                <span key={time} className="time-tag">
                  {time}
                </span>
              ))
            ) : (
              <p className="no-times-selected">No times selected</p>
            )}
          </div>
          <button onClick={handleSubmit}>Save Times</button>
        </>
      )}

      {loading && <p>Loading saved times...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TimeSelectionForm;
