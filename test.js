import React, { useState } from 'react';
import ServiceSelection from './ServiceSelection';
import TimeslotSelection from './TimeslotSelection';
import './AppointmentBooking.css';

function AppointmentBooking() {
  const [services] = useState([
    { id: 1, name: "Manicure", duration: "30 mins" },
    { id: 2, name: "Pedicure", duration: "45 mins" },
  ]);

  const [timeslots] = useState([
    { id: 1, time: "10:00 AM - 10:30 AM", date: "2024-12-14", service: "Manicure" },
    { id: 1, time: "11:00 AM - 12:30 AM", date: "2024-12-14", service: "Pedicure" },
    { id: 1, time: "10:00 AM - 10:30 AM", date: "2024-12-15", service: "Manicure" },
    { id: 2, time: "11:00 AM - 11:45 AM", date: "2024-12-15", service: "Pedicure" },
    { id: 3, time: "02:00 PM - 02:30 PM", date: "2024-12-16", service: "Manicure" },
    { id: 4, time: "03:00 PM - 03:45 PM", date: "2024-12-16", service: "Pedicure" },
    { id: 5, time: "04:00 PM - 04:30 PM", date: "2024-12-15", service: "Manicure" },
  ]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [step, setStep] = useState(1); // Step for tracking progress
  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null);
  

  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeslotId(timeslot.id);  // Update the selected timeslot ID
    setSelectedTimeslot(timeslot); // Set selected timeslot
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedTimeslot(null); // Reset timeslot selection when service changes
    setStep(2); // Move to timeslot selection
  };

  const handleConfirmAppointment = () => {
    if (selectedService && selectedTimeslot) {
      setAppointmentConfirmed(true);
    }
  };

  const handleCancel = () => {
    // Reset all selections and go back to the initial state
    
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate('');
    setStep(1); // Go back to step 1
  };

  const handleCancelAppointment = () => {
    // Cancel the appointment and reset everything
    setAppointmentConfirmed(false);
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate('');
  };

  // Filter timeslots by the selected date and service
  const filteredTimeslots = selectedDate
    ? timeslots.filter(timeslot => timeslot.date === selectedDate && (!selectedService || timeslot.service === selectedService.name))
    : timeslots;

  // Back button handler for different steps
  const handleBack = () => {
    if (selectedService) {
      setSelectedService(null);
      setStep(1);
    } else if (selectedDate) {
      setSelectedDate('');
      setStep(1);
    }
  };


  return (
    <div className="appointment-booking">
    <h1>Book an Appointment</h1>
  
    {/* Date Picker and Display */}
    {!appointmentConfirmed && (
      <div>
        {/* Date Picker */}
        {!selectedDate && (
          <div>
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Disable past dates
              placeholder="Select a date"
            />
          </div>
        )}
  
        {/* Once a date is selected, show services */}
        {selectedDate && (
          <div>
            <p><strong>Selected Date: {selectedDate}</strong></p>

    
  
            {!selectedService && (
              <ServiceSelection services={services} onSelectService={handleServiceSelect} onBack={handleBack} />
            )}
  
            {selectedService && (
              <>
                <TimeslotSelection
                  timeslots={filteredTimeslots}
                  onSelectTimeslot={handleSelectTimeslot} // Use handleSelectTimeslot directly
                  selectedTimeslotId={selectedTimeslotId} // Pass the selectedTimeslotId to highlight the selected button
                />
                {selectedService && selectedTimeslot ? (
                  <div className="confirm-button-container">
                    <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
                  </div>
                ) : (
                  <p>Please select a timeslot to confirm.</p>
                )}
                {/* Cancel and Back buttons next to each other */}
                <div className="button-container">
                  <button onClick={handleCancel}>Cancel</button>
                  <button onClick={handleBack}>Back</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )}
  
    {/* Appointment Confirmed */}
    {appointmentConfirmed && (
      <div className="appointment-confirmed">
        <h2>Appointment Confirmed</h2>
        <p><strong>Service:</strong> {selectedService.name}</p>
        <p><strong>Timeslot:</strong> {selectedTimeslot.time}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <button onClick={handleCancelAppointment}>Cancel Appointment</button> {/* Full width cancel appointment button */}
      </div>
    )}
    </div>
  );
}

export default AppointmentBooking;
