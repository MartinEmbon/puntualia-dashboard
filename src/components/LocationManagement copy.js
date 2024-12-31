import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationManagement.css";

function LocationManagement() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    description: "",
  });

  // Get the username from localStorage (after login)
  const username = localStorage.getItem("username"); // Retrieve the stored username

  // Fetch the user's locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-locations?username=${username}` // Send username to the backend
      );

      console.log("API Response:", response.data); // Log the response data to check its structure

      // Check if the response is an array before updating state
      if (Array.isArray(response.data)) {
        setLocations(response.data);
      } else {
        console.error("The API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch locations on mount
  useEffect(() => {
    if (username) {
      fetchLocations();
    } else {
      console.log("No username found");
    }
  }, [username]); // Dependency on username to refetch locations when it changes

  // Handle adding a new location
  const addLocation = async () => {
    if (!newLocation.name || !newLocation.address) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      console.log("Sending location data:", { ...newLocation, username });

      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-create-location", // Adjust the API endpoint
        { ...newLocation, username }
      );

      console.log("Location added response:", response); // Log the response

      if (response.status === 201) {
        alert("Location added successfully!");

        // After successfully adding, fetch the locations again
        await fetchLocations(); // Re-fetch the locations from the backend

        setNewLocation({ name: "", address: "", description: "" }); // Reset form
      } else {
        alert("Failed to add location.");
      }
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Error adding location, please try again.");
    }
  };

  // Handle deleting a location
  const deleteLocation = async (locationId) => {
    try {
      const response = await axios.delete(
        `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-delete-locations?locationId=${locationId}&username=${username}`
      );

      console.log("Location deleted response:", response);

      if (response.status === 200) {
        alert("Location deleted successfully!");

        // Remove the deleted location from the local state
        setLocations(locations.filter((location) => location.id !== locationId));
      } else {
        alert("Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Error deleting location, please try again.");
    }
  };

  return (
    <div className="location-management">
      <h2>Location Management</h2>
      {/* Ensure locations is an array before calling map */}
      <ul>
        {Array.isArray(locations) && locations.length > 0 ? (
          locations.map((location) => (
            <li key={location.id}>
              <strong>{location.name}</strong> - {location.address}: {location.description}
              <button
                className="delete-button"
                onClick={() => deleteLocation(location.id)} // Call delete function on click
              >
                <i className="fas fa-trash trash-icon"></i> {/* Font Awesome trash icon */}
              </button>
            </li>
          ))
        ) : (
          <li>No locations available</li>
        )}
      </ul>
      <div className="add-location">
        <input
          type="text"
          placeholder="Location Name"
          value={newLocation.name}
          onChange={(e) =>
            setNewLocation({ ...newLocation, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={newLocation.address}
          onChange={(e) =>
            setNewLocation({ ...newLocation, address: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newLocation.description}
          onChange={(e) =>
            setNewLocation({ ...newLocation, description: e.target.value })
          }
        />
        <button onClick={addLocation}>Add Location</button>
      </div>
    </div>
  );
}

export default LocationManagement;
