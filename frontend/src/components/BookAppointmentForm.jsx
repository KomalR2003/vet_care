import React, { useState, useEffect } from 'react';
import { appointmentsAPI, doctorsAPI } from '../api/api';

const BookAppointmentForm = ({ pets,  appointments, setAppointments, setCurrentView }) => {
  const [form, setForm] = useState({
    pet: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  const [doctors, setDoctors] = useState([]);

   useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorsAPI.getDoctors();
        console.log("Fetched doctors:", res.data); // debug
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

   const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        pet: form.pet,
        doctor: form.doctor,
        date: form.date,
        time: form.time,
        reason: form.reason,
        status: "pending",
      };

      const response = await appointmentsAPI.createAppointment(appointmentData);
      setAppointments([...appointments, response.data]);
      setCurrentView("my-appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div>
       <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleBookAppointment} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Appointment</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Pet</label>
          <select
            name="pet"
            value={form.pet}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Pet</option>
            {pets.map(pet => (
              <option key={pet._id} value={pet._id}>{pet.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
            <label className="block mb-1 text-gray-700">Doctor</label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Doctor</option>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.userId?.name} — {doc.specialization}
                  </option>
                ))
              ) : (
                <option disabled>Loading doctors...</option>
              )}
            </select>
          </div>


        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Reason</label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Book Appointment
        </button>
      </form>
    </div>
    </div>
  );
};

export default BookAppointmentForm;