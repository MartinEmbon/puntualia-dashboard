import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./AppointmentOverview.css"

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-upcoming-events');
        console.log("Appointments Data:", response.data);  // Log the response data

        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch('https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-upcoming-events', {
        id,
        status: newStatus,
      });
      if (response.status === 200) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.id === id ? { ...appointment, status: newStatus } : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const clientMatch = appointment.client.toLowerCase().includes(searchQuery.toLowerCase());
    const dniMatch = appointment.dni.includes(searchQuery);
    return clientMatch || dniMatch;
  });


  if (loading) return <div>Loading...</div>;

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Client or DNI"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No upcoming appointments</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>DNI</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Time Slot Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.client}</td>
                <td>{appointment.dni}</td>
                <td>{appointment.service.name}</td>
                <td>{appointment.selectedDate}</td>
                <td>{appointment.timeSlot.time}</td>
                <td>{appointment.timeSlot.service}</td>
                <td>{appointment.status}</td>
                <td>
                  <button
                    className="status-button"
                    onClick={() => changeStatus(appointment.id, appointment.status === 'pending' ? 'confirmed' : 'pending')}
                  >
                    <i className={`fas ${appointment.status === 'pending' ? 'fa-check' : 'fa-times'} status-icon`}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UpcomingAppointments;
