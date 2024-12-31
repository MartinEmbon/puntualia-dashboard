import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceManagement.css";

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    description: "",
  });

  // Get the username from localStorage (after login)
  const username = localStorage.getItem("username"); // Retrieve the stored username

  // Fetch the user's services
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-services?username=${username}` // Send username to the backend
      );

      console.log("API Response:", response.data); // Log the response data to check its structure

      // Check if the response is an array before updating state
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error("The API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch services on mount
  useEffect(() => {
    if (username) {
      fetchServices();
    } else {
      console.log("No username found");
    }
  }, [username]); // Dependency on username to refetch services when it changes

  // Handle adding a new service
  const addService = async () => {
    if (!newService.name) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      console.log("Sending service data:", { ...newService, username });

      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-create-service", // Adjust the API endpoint
        { ...newService, username }
      );

      console.log("Service added response:", response); // Log the response

      if (response.status === 201) {
        alert("Service added successfully!");

        // After successfully adding, fetch the services again
        await fetchServices(); // Re-fetch the services from the backend

        setNewService({ name: "", duration: "", description: "" }); // Reset form
      } else {
        alert("Failed to add service.");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service, please try again.");
    }
  };

  // Handle deleting a service
  const deleteService = async (serviceId) => {
    try {
      const response = await axios.delete(
        `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-delete-services?serviceId=${serviceId}&username=${username}`
      );

      console.log("Service deleted response:", response);

      if (response.status === 200) {
        alert("Service deleted successfully!");

        // Remove the deleted service from the local state
        setServices(services.filter((service) => service.id !== serviceId));
      } else {
        alert("Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service, please try again.");
    }
  };

  return (
    <div className="service-management">
      <h2>Service Management</h2>
      {/* Ensure services is an array before calling map */}
      <ul>
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service) => (
            <li key={service.id}>
              <strong>{service.name}</strong> ({service.duration}):{" "}
              {service.description}
              <button
                className="delete-button"
                onClick={() => deleteService(service.id)} // Call delete function on click
              >
                <i className="fas fa-trash trash-icon"></i> {/* Font Awesome trash icon */}
                </button>{" "}
            </li>
          ))
        ) : (
          <li>No services available</li>
        )}
      </ul>
      <div className="add-service">
        <input
          type="text"
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Duration"
          value={newService.duration}
          onChange={(e) =>
            setNewService({ ...newService, duration: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newService.description}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
        />
        <button onClick={addService}>Add Service</button>
      </div>
    </div>
  );
}

export default ServiceManagement;
