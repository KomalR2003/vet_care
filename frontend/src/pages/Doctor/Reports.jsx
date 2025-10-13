import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { BarChart3, FileText, Eye, Download, Plus, Calendar, User, Heart, Trash2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { reportsAPI, petsAPI, appointmentsAPI } from '../../api/api';

const Reports = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchPets();
    fetchAppointments();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getPets();
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAppointments();
      const completedAppts = response.data.filter(apt => apt.status === 'completed' || apt.status === 'confirmed');
      setAppointments(completedAppts);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      await reportsAPI.downloadReportPDF(reportId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportsAPI.deleteReport(reportId);
        await fetchReports();
        alert('Report deleted successfully');
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const CreateReportModal = () => {
    const [formData, setFormData] = useState({
      pet: '',
      appointment: '',
      summary: '',
      diagnosis: '',
      prescription: '',
      notes: '',
      medications: [],
      recommendations: []
    });
    const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', duration: '' });
    const [newRecommendation, setNewRecommendation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedPetAppointments, setSelectedPetAppointments] = useState([]);

    useEffect(() => {
      if (formData.pet) {
        const petAppts = appointments.filter(apt => 
          (apt.pet?._id === formData.pet || apt.pet === formData.pet)
        );
        setSelectedPetAppointments(petAppts);
      } else {
        setSelectedPetAppointments([]);
      }
    }, [formData.pet]);

    const handlePetChange = (e) => {
      setFormData(prev => ({
        ...prev,
        pet: e.target.value,
        appointment: ''
      }));
    };

    const addMedication = () => {
      if (newMedication.name && newMedication.dosage && newMedication.frequency) {
        setFormData(prev => ({
          ...prev,
          medications: [...prev.medications, newMedication]
        }));
        setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
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
      setSubmitting(true);

      try {
        if (!formData.pet || !formData.summary) {
          alert('Please fill in all required fields');
          setSubmitting(false);
          return;
        }

        // Clean up the data - remove empty strings and undefined values
        const reportData = {
          pet: formData.pet,
          summary: formData.summary,
          diagnosis: formData.diagnosis || undefined,
          prescription: formData.prescription || undefined,
          notes: formData.notes || undefined,
          medications: formData.medications.length > 0 ? formData.medications : undefined,
          recommendations: formData.recommendations.length > 0 ? formData.recommendations : undefined
        };

        // Only include appointment if it has a valid value
        if (formData.appointment && formData.appointment.trim() !== '') {
          reportData.appointment = formData.appointment;
        }

        // Remove undefined values from the object
        Object.keys(reportData).forEach(key => {
          if (reportData[key] === undefined) {
            delete reportData[key];
          }
        });

        await reportsAPI.createReport(reportData);
        setSuccess(true);
        setTimeout(async () => {
          await fetchReports();
          setShowCreateModal(false);
          setSuccess(false);
        }, 1500);
      } catch (error) {
        console.error('Error creating report:', error);
        alert('Failed to create report: ' + (error.response?.data?.error || error.message));
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
          <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl z-10">
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
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {success ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Report Created Successfully!</h3>
              <p className="text-gray-600">The medical report has been saved and is available to the pet owner.</p>
            </div>
          ) : (
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pet <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.pet}
                    onChange={handlePetChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a pet...</option>
                    {pets.map(pet => (
                      <option key={pet._id} value={pet._id}>
                        {pet.name} - {pet.species} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Appointment (Optional)
                  </label>
                  <select
                    value={formData.appointment}
                    onChange={(e) => setFormData({ ...formData, appointment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.pet}
                  >
                    <option value="">No appointment link</option>
                    {selectedPetAppointments.map(apt => (
                      <option key={apt._id} value={apt._id}>
                        {new Date(apt.date).toLocaleDateString()} - {apt.time} ({apt.reason})
                      </option>
                    ))}
                  </select>
                  {!formData.pet && (
                    <p className="text-xs text-gray-500 mt-1">Select a pet first to see appointments</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of the consultation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed diagnosis..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Medications</h3>
                {formData.medications.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {formData.medications.map((med, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{med.name}</p>
                          <p className="text-sm text-gray-600">
                            {med.dosage} | {med.frequency} {med.duration && `| ${med.duration}`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder="Medicine name"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="Dosage (e.g., 500mg)"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    placeholder="Frequency (e.g., twice daily)"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Details</label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional prescription instructions..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Recommendations</h3>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional observations or notes..."
                />
              </div>
            </div>
          )}

          {!success && (
            <div className="border-t p-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
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
          )}
        </div>
      </div>
    );
  };

  const ReportDetailsModal = () => {
    if (!selectedReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-blue-600" />
                  Pet Information
                </h3>
                <p><span className="font-medium">Name:</span> {selectedReport.pet?.name}</p>
                <p><span className="font-medium">Species:</span> {selectedReport.pet?.species}</p>
                <p><span className="font-medium">Breed:</span> {selectedReport.pet?.breed}</p>
                <p><span className="font-medium">Age:</span> {selectedReport.pet?.age} years</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Owner Information
                </h3>
                <p><span className="font-medium">Name:</span> {selectedReport.owner?.name}</p>
                <p><span className="font-medium">Email:</span> {selectedReport.owner?.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedReport.owner?.phone}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Report Date
              </h3>
              <p>{new Date(selectedReport.date).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
              <p className="text-gray-700">{selectedReport.summary}</p>
            </div>

            {selectedReport.diagnosis && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
                <p className="text-gray-700">{selectedReport.diagnosis}</p>
              </div>
            )}

            {selectedReport.medications && selectedReport.medications.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Medications</h3>
                <div className="space-y-2">
                  {selectedReport.medications.map((med, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        Dosage: {med.dosage} | Frequency: {med.frequency}
                        {med.duration && ` | Duration: ${med.duration}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedReport.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedReport.notes && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Additional Notes</h3>
                <p className="text-gray-700">{selectedReport.notes}</p>
              </div>
            )}
          </div>

          <div className="border-t p-6 flex justify-end space-x-3">
            <button
              onClick={() => handleDownloadPDF(selectedReport._id)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        user={user}
        setCurrentView={setCurrentView}
        setUser={setUser}
        currentView={currentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 ml-0 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Medical Reports</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Report
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p>No reports found. Create your first report!</p>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{report.pet?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{report.owner?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{report.summary}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(report)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(report._id)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Download PDF"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report._id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete Report"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showCreateModal && <CreateReportModal />}
      {showDetailsModal && <ReportDetailsModal />}
    </div>
  );
};

export default Reports;