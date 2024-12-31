import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DateManagement.css";

const DaySelectionForm = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const [savedDays, setSavedDays] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  // Fetch saved days for selected service
  // useEffect(() => {
  //   const fetchSavedDays = async () => {
  //     if (!username || !selectedService) return;

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await axios.get(
  //         `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-dates?username=${username}&serviceId=${selectedService}`
  //       );

  //       if (response.status === 200 && response.data.days) {
  //         setSelectedDays(response.data.days);
  //       } else {
  //         setSelectedDays([]);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching saved days:", err);
  //       setError("Failed to fetch saved days.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSavedDays();
  // }, [username, selectedService]);
  useEffect(() => {
    const fetchSavedDays = async () => {
      if (!username || !selectedService) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-dates?username=${username}&serviceId=${selectedService}`
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
  }, [username, selectedService]);

  const handleSelectAll = () => {
    setSelectedDays(daysOfWeek);
  };

  const handleUnselectAll = () => {
    setSelectedDays([]);
  };

  const handleCheckboxChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!username || !selectedService) {
      alert("Please select a service and log in to submit your selected days.");
      return;
    }

    try {
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-date-management",
        { username, serviceId: selectedService, days: selectedDays }
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

  return (
    <div className="date-management">
      <h2>Available Days</h2>
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
          <div className="day-selection-form">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={() =>
                  selectedDays.length === daysOfWeek.length
                    ? handleUnselectAll()
                    : handleSelectAll()
                }
                checked={selectedDays.length === daysOfWeek.length}
              />
              Select All
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={handleUnselectAll}
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
          </div>

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
          <button onClick={handleSubmit}>Save Days</button>
        </>
      )}

      {loading && <p>Loading saved days...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default DaySelectionForm;
