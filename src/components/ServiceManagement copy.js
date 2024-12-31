// src/components/ServiceManagement.js
import React, { useState } from "react";
import "./ServiceManagement.css";

function ServiceManagement() {
  const [services, setServices] = useState([
    { id: 1, name: "Manicure", duration: "30 mins", description: "Basic manicure." },
    { id: 2, name: "Pedicure", duration: "45 mins", description: "Basic pedicure." },
  ]);
  const [newService, setNewService] = useState({ name: "", duration: "", description: "" });

  const addService = () => {
    setServices([
      ...services,
      { id: Date.now(), ...newService },
    ]);
    setNewService({ name: "", duration: "", description: "" });
  };

  return (
    <div className="service-management">
      <h2>Service Management</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <strong>{service.name}</strong> ({service.duration}): {service.description}
          </li>
        ))}
      </ul>
      <div className="add-service">
        <input
          type="text"
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newService.duration}
          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <button onClick={addService}>Add Service</button>
      </div>
    </div>
  );
}
export default ServiceManagement;
