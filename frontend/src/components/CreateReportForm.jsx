import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const CreateReportForm = ({ onClose, onSuccess, appointment, pets = [] }) => {
  const [formData, setFormData] = useState({
    pet: appointment?.pet?._id || '',
    appointment: appointment?._id || '',
    summary: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    medications: [],
    recommendations: []
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const [newRecommendation, setNewRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication]
      }));
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
      });
    }
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, newRecommendation.trim()]
      }));
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (index) => {
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      const data = await response.json();
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(data);
        onClose?.();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Create Medical Report</h2>
                <p className="text-sm text-gray-500">Document patient examination and treatment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Report Created Successfully!</h3>
            <p className="text-gray-600">The medical report has been saved to the system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Pet Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pet <span className="text-red-500">*</span>
              </label>
              <select
                name="pet"
                value={formData.pet}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a pet...</option>
                {pets.map(pet => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} - {pet.species} ({pet.breed})
                  </option>
                ))}
              </select>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief summary of the consultation..."
                required
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed diagnosis..."
              />
            </div>

            {/* Medications Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
              
              {/* Current Medications List */}
              {formData.medications.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.medications.map((med, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">
                          Dosage: {med.dosage} | Frequency: {med.frequency}
                          {med.duration && ` | Duration: ${med.duration}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Medication */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  name="name"
                  value={newMedication.name}
                  onChange={handleMedicationChange}
                  placeholder="Medicine name"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="dosage"
                  value={newMedication.dosage}
                  onChange={handleMedicationChange}
                  placeholder="Dosage (e.g., 500mg)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="frequency"
                  value={newMedication.frequency}
                  onChange={handleMedicationChange}
                  placeholder="Frequency (e.g., twice daily)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="duration"
                  value={newMedication.duration}
                  onChange={handleMedicationChange}
                  placeholder="Duration (e.g., 7 days)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {/* Prescription */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescription Details
              </label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional prescription instructions..."
              />
            </div>

            {/* Recommendations Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
              
              {/* Current Recommendations List */}
              {formData.recommendations.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex justify-between items-center">
                      <p className="text-gray-900">{rec}</p>
                      <button
                        type="button"
                        onClick={() => removeRecommendation(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Recommendation */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  placeholder="Add a recommendation..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRecommendation();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addRecommendation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional observations or notes..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Create Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateReportForm;