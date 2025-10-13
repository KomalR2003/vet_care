import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { FileText, Download, Eye, Calendar, User, Heart, X, Filter } from 'lucide-react';
import { reportsAPI } from '../../api/api';

const MedicalReports = ({ 
  user, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterPet, setFilterPet] = useState('all');
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    // Extract unique pets from reports
    const uniquePets = [...new Map(reports.map(r => [r.pet?._id, r.pet])).values()];
    setPets(uniquePets);

    // Filter reports by pet
    if (filterPet === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(r => r.pet?._id === filterPet));
    }
  }, [reports, filterPet]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId, petName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-report-${petName}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const ReportDetailsModal = () => {
    if (!selectedReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Medical Report</h2>
                <p className="text-blue-100 text-sm">Report ID: {selectedReport._id}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Pet and Owner Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Pet Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-900 font-semibold">{selectedReport.pet?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Species:</span>
                    <span className="text-gray-900">{selectedReport.pet?.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Breed:</span>
                    <span className="text-gray-900">{selectedReport.pet?.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Age:</span>
                    <span className="text-gray-900">{selectedReport.pet?.age} years</span>
                  </div>
                  {selectedReport.pet?.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Weight:</span>
                      <span className="text-gray-900">{selectedReport.pet?.weight} kg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Information */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Doctor Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Doctor:</span>
                    <span className="text-gray-900 font-semibold">Dr. {selectedReport.doctor?.userId?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Specialization:</span>
                    <span className="text-gray-900">{selectedReport.doctor?.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-900">{new Date(selectedReport.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{selectedReport.summary}</p>
            </div>

            {/* Diagnosis */}
            {selectedReport.diagnosis && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-3">Diagnosis</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.diagnosis}</p>
              </div>
            )}

            {/* Medications */}
            {selectedReport.medications && selectedReport.medications.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Prescribed Medications</h3>
                <div className="space-y-3">
                  {selectedReport.medications.map((med, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg mb-1">{index + 1}. {med.name}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-500 mr-2">Dosage:</span>
                              <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">{med.dosage}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-500 mr-2">Frequency:</span>
                              <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">{med.frequency}</span>
                            </div>
                            {med.duration && (
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-gray-500 mr-2">Duration:</span>
                                <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">{med.duration}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescription Details */}
            {selectedReport.prescription && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-3">Prescription Details</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.prescription}</p>
              </div>
            )}

            {/* Recommendations */}
            {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Doctor's Recommendations</h3>
                <ul className="space-y-2">
                  {selectedReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Notes */}
            {selectedReport.notes && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-3">Additional Notes</h3>
                <p className="text-gray-700 leading-relaxed italic">{selectedReport.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 p-6 rounded-b-2xl flex flex-col sm:flex-row justify-between gap-3">
            <div className="text-sm text-gray-600">
              <p>Generated on: {new Date(selectedReport.createdAt || selectedReport.date).toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownloadPDF(selectedReport._id, selectedReport.pet?.name)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
            </div>
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
      <div className="flex-1 ml-0 overflow-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical Reports</h1>
            </div>
            <p className="text-gray-600">View and download your pet's medical reports</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterPet}
                onChange={(e) => setFilterPet(e.target.value)}
                className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Pets</option>
                {pets.map(pet => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} - {pet.species}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
              </span>
            </div>
          </div>

          {/* Reports Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Medical Reports Found</h3>
              <p className="text-gray-600">
                {filterPet === 'all' 
                  ? "You don't have any medical reports yet. They will appear here after your pet's appointments."
                  : "No reports found for the selected pet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div 
                  key={report._id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2" />
                        <h3 className="font-bold text-lg">{report.pet?.name}</h3>
                      </div>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        {report.pet?.species}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-blue-100">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(report.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Doctor:</p>
                      <p className="font-semibold text-gray-900">Dr. {report.doctor?.userId?.name}</p>
                      <p className="text-xs text-gray-500">{report.doctor?.specialization}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Summary:</p>
                      <p className="text-sm text-gray-800 line-clamp-3">{report.summary}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {report.diagnosis && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Diagnosis Available
                        </span>
                      )}
                      {report.medications && report.medications.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {report.medications.length} Medication{report.medications.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {report.recommendations && report.recommendations.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {report.recommendations.length} Recommendation{report.recommendations.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(report._id, report.pet?.name)}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && <ReportDetailsModal />}
    </div>
  );
};

export default MedicalReports;