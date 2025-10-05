import React, { useState, useEffect } from 'react';
import { Calendar, User, Heart, Clock, FileText } from 'lucide-react';
import { appointmentsAPI, doctorsAPI } from '../api/api';

const BookAppointmentForm = ({ 
  pets, 
  appointments, 
  setAppointments, 
  setCurrentView,
  refreshAppointments 
}) => {
  const [form, setForm] = useState({
    pet: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setFetchingDoctors(true);
        const res = await doctorsAPI.getDoctors();
        console.log("Fetched doctors:", res.data);
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError('Failed to load doctors. Please refresh the page.');
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.pet || !form.doctor || !form.date || !form.time || !form.reason) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const appointmentData = {
        pet: form.pet,
        doctor: form.doctor,
        date: form.date,
        time: form.time,
        reason: form.reason,
        notes: form.notes,
        status: 'pending'
      };

      console.log('Booking appointment:', appointmentData);

      const response = await appointmentsAPI.createAppointment(appointmentData);
      
      setSuccess(true);
      
      if (refreshAppointments) {
        await refreshAppointments();
      } else {
        setAppointments([...appointments, response.data]);
      }
      
      setForm({
        pet: '',
        doctor: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
      });

      setTimeout(() => {
        setSuccess(false);
        setCurrentView('my-appointments');
      }, 2000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Schedule a visit for your pet</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Appointment booked successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleBookAppointment} className="bg-white p-6 lg:p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-blue-600" />
                Select Pet *
              </label>
              <select
                name="pet"
                value={form.pet}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose your pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} - {pet.species} ({pet.breed})
                  </option>
                ))}
              </select>
              {pets.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No pets found.{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('add-pet')}
                    className="text-blue-600 hover:underline"
                  >
                    Add a pet first
                  </button>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Select Doctor *
              </label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={fetchingDoctors}
              >
                <option value="">
                  {fetchingDoctors ? 'Loading doctors...' : 'Choose a doctor'}
                </option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.userId?.name} - {doc.specialization}
                  </option>
                ))}
              </select>
              {!fetchingDoctors && doctors.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  No doctors available at the moment.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Appointment Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Appointment Time *
                </label>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Reason for Visit *
              </label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g., Regular checkup, Vaccination, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional information for the doctor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentView('my-appointments')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || pets.length === 0 || doctors.length === 0 || fetchingDoctors}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentForm;