// src/components/TimeslotManagement.js
import React, { useState } from "react";
import "./TimeslotManagement.css";

function TimeslotManagement() {
  const [timeslots, setTimeslots] = useState([
    { id: 1, time: "10:00 AM - 10:30 AM", service: "Manicure" },
    { id: 2, time: "11:00 AM - 11:45 AM", service: "Pedicure" },
  ]);
  const [newTimeslot, setNewTimeslot] = useState({ time: "", service: "" });

  const addTimeslot = () => {
    setTimeslots([
      ...timeslots,
      { id: Date.now(), ...newTimeslot },
    ]);
    setNewTimeslot({ time: "", service: "" });
  };

  return (
    <div className="timeslot-management">
      <h2>Timeslot Management</h2>
      <ul>
        {timeslots.map((slot) => (
          <li key={slot.id}>
            <strong>{slot.time}</strong> - {slot.service}
          </li>
        ))}
      </ul>
      <div className="add-timeslot">
        <input
          type="text"
          placeholder="Time (e.g., 10:00 AM - 10:30 AM)"
          value={newTimeslot.time}
          onChange={(e) => setNewTimeslot({ ...newTimeslot, time: e.target.value })}
        />
        <input
          type="text"
          placeholder="Service"
          value={newTimeslot.service}
          onChange={(e) => setNewTimeslot({ ...newTimeslot, service: e.target.value })}
        />
        <button onClick={addTimeslot}>Add Timeslot</button>
      </div>
    </div>
  );
}

export default TimeslotManagement;