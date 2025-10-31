import React, { useState, useEffect } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { FileText, Download, Eye, Calendar, User, Heart, X, Filter, BarChart3 } from 'lucide-react';
import { reportsAPI } from '../../../api/api';

const AdminReports = ({ 
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
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    // Extract unique pets, doctors, and owners from reports
    const uniquePets = [...new Map(reports.map(r => [r.pet?._id, r.pet])).values()];
    const uniqueDoctors = [...new Map(reports.map(r => [r.doctor?._id, r.doctor])).values()];
    const uniqueOwners = [...new Map(reports.map(r => [r.owner?._id, r.owner])).values()];
    
    setPets(uniquePets);
    setDoctors(uniqueDoctors);
    setOwners(uniqueOwners);

    // Apply filters
    let filtered = reports;

    if (filterPet !== 'all') {
      filtered = filtered.filter(r => r.pet?._id === filterPet);
    }
    if (filterDoctor !== 'all') {
      filtered = filtered.filter(r => r.doctor?._id === filterDoctor);
    }
    if (filterOwner !== 'all') {
      filtered = filtered.filter(r => r.owner?._id === filterOwner);
    }
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctor?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, filterPet, filterDoctor, filterOwner, searchTerm]);

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
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

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Triple Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pet Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Pet</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Name:</span>
                    <p className="text-gray-900 font-semibold">{selectedReport.pet?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Species:</span>
                    <p className="text-gray-900">{selectedReport.pet?.species}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Breed:</span>
                    <p className="text-gray-900">{selectedReport.pet?.breed}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Age:</span>
                    <p className="text-gray-900">{selectedReport.pet?.age} years</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Owner</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Name:</span>
                    <p className="text-gray-900 font-semibold">{selectedReport.owner?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Email:</span>
                    <p className="text-gray-900 text-xs truncate">{selectedReport.owner?.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <p className="text-gray-900">{selectedReport.owner?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Doctor</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Name:</span>
                    <p className="text-gray-900 font-semibold">Dr. {selectedReport.doctor?.userId?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Specialization:</span>
                    <p className="text-gray-900">{selectedReport.doctor?.specialization}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Date:</span>
                    <p className="text-gray-900">{new Date(selectedReport.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 text-lg mb-3">Summary</h3>
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
                <h3 className="font-bold text-gray-800 text-lg mb-4">Medications</h3>
                <div className="space-y-3">
                  {selectedReport.medications.map((med, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                      <p className="font-semibold text-gray-900 mb-2">{index + 1}. {med.name}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Dosage:</span>
                          <p className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded mt-1">{med.dosage}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Frequency:</span>
                          <p className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded mt-1">{med.frequency}</p>
                        </div>
                        {med.duration && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Duration:</span>
                            <p className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded mt-1">{med.duration}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {selectedReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{rec}</span>
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

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6 rounded-b-2xl flex flex-col sm:flex-row justify-between gap-3">
            <div className="text-sm text-gray-600">
              <p>Generated: {new Date(selectedReport.createdAt || selectedReport.date).toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownloadPDF(selectedReport._id, selectedReport.pet?.name)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium shadow-md"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
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
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical Reports</h1>
            </div>
            <p className="text-gray-600">View and manage all medical reports generated by doctors</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search by pet name, owner, doctor, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Pet</label>
                <select
                  value={filterPet}
                  onChange={(e) => setFilterPet(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Pets</option>
                  {pets.map(pet => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} - {pet.species}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Doctor</label>
                <select
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Doctors</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.userId?.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Owner</label>
                <select
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Owners</option>
                  {owners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              <span>{filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found</span>
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
              <p className="text-gray-600">No reports match your filters. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                            <span className="font-medium text-gray-900">{report.pet?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{report.owner?.name}</span>
                          <p className="text-xs text-gray-500">{report.owner?.email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">Dr. {report.doctor?.userId?.name}</span>
                          <p className="text-xs text-gray-500">{report.doctor?.specialization}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(report.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-700 truncate">{report.summary}</p>
                        </td>
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
                              onClick={() => handleDownloadPDF(report._id, report.pet?.name)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Download PDF"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && <ReportDetailsModal />}
    </div>
  );
};

export default AdminReports;