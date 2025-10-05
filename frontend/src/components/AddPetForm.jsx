import React, { useState } from 'react';
import { petsAPI } from '../api/api';

const AddPetForm = ({ pets, setPets, setCurrentView, refreshPets }) => {
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    medical_history: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddPet = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const petData = {
        name: form.name,
        species: form.species,
        breed: form.breed,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        medical_history: form.medical_history.split(',').map(h => h.trim()).filter(h => h)
      };
      
      console.log('Sending pet data:', petData);
      
      const response = await petsAPI.createPet(petData);
      
      // Refresh data immediately
      if (refreshPets) {
        await refreshPets();
      } else {
        setPets([...pets, response.data]);
      }
      
      alert('Pet added successfully!');
      setCurrentView('my-pets');
    } catch (error) {
      console.error('Error adding pet:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setCurrentView('dashboard')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors m-4"
      >
        Back to Dashboard
      </button>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form onSubmit={handleAddPet} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Pet</h2>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Species</label>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Breed</label>
            <input
              type="text"
              name="breed"
              value={form.breed}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Weight</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-700">Medical History (comma separated)</label>
            <input
              type="text"
              name="medical_history"
              value={form.medical_history}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding Pet...' : 'Add Pet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetForm;