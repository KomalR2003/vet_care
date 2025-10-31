import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { FileText, Search, Eye, XCircle } from 'lucide-react';
import { reportsAPI } from '../../api/api';

const PatientHistory = ({
  user,  pets = [], setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [petHistory, setPetHistory] = useState([]);

  // Fetch all reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getReports();
      console.log('📊 Fetched reports:', response.data); // Debug log
      setReports(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      setReports([]);
    }
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewHistory = (pet) => {
    console.log('🐕 Selected pet FULL OBJECT:', JSON.stringify(pet, null, 2));
    console.log('📋 All reports:', JSON.stringify(reports, null, 2));
    
    setSelectedPet(pet);
    setLoading(true);
    
    // Filter reports for this specific pet - try multiple matching strategies
    const petReports = reports.filter(report => {
      // Get pet ID from report in different possible formats
      let reportPetId = null;
      if (report.pet) {
        if (typeof report.pet === 'string') {
          reportPetId = report.pet;
        } else if (report.pet._id) {
          reportPetId = report.pet._id;
        } else if (report.pet.id) {
          reportPetId = report.pet.id;
        }
      }
      
      // Get selected pet ID - try ALL possible sources
      const selectedPetId = pet._id || pet.id || pet.petId;
      
      // Get pet names for comparison (case-insensitive, trimmed)
      const reportPetName = (report.pet?.name || '').toLowerCase().trim();
      const selectedPetName = (pet.name || pet.petName || '').toLowerCase().trim();
      
      // Get pet species for additional matching
      const reportPetSpecies = (report.pet?.species || '').toLowerCase().trim();
      const selectedPetSpecies = (pet.species || '').toLowerCase().trim();
      
      // Match by ID first, then by name, then by name+species combo
      const idMatch = reportPetId && selectedPetId && reportPetId === selectedPetId;
      const nameMatch = reportPetName && selectedPetName && reportPetName === selectedPetName;
      const nameSpeciesMatch = nameMatch && reportPetSpecies && selectedPetSpecies && 
                               reportPetSpecies === selectedPetSpecies;
      
      console.log('🔍 Comparing Report:', {
        reportPetId,
        selectedPetId,
        reportPetName,
        selectedPetName,
        reportPetSpecies,
        selectedPetSpecies,
        idMatch,
        nameMatch,
        nameSpeciesMatch,
        finalMatch: idMatch || nameMatch || nameSpeciesMatch
      });
      
      return idMatch || nameMatch || nameSpeciesMatch;
    });
    
    console.log('✅ Filtered pet reports COUNT:', petReports.length);
    console.log('✅ Filtered pet reports:', JSON.stringify(petReports, null, 2));
    
    // Sort by date (most recent first)
    const sortedReports = petReports.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    setPetHistory(sortedReports);
    setLoading(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
    setPetHistory([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
        <div className="flex items-center mb-6">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Patient History</h1>
        </div>
        <div className="mb-6 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search pet by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full max-w-xs"
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pet List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Pet Name</th>
                  <th className="py-2">Species</th>
                  <th className="py-2">Breed</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">No pets found</td>
                  </tr>
                ) : (
                  filteredPets.map((pet, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2">{pet.name}</td>
                      <td className="py-2">{pet.species}</td>
                      <td className="py-2">{pet.breed}</td>
                      <td className="py-2">{pet.owner?.name || pet.ownerName || 'N/A'}</td>
                      <td className="py-2">
                        <button 
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center" 
                          onClick={() => handleViewHistory(pet)}
                        > 
                          <Eye className="w-4 h-4 mr-1" /> View History 
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popup Modal for Patient History */}
        {showModal && selectedPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative min-h-[400px]">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeModal}
                title="Close"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Patient History for {selectedPet?.name}
              </h2>
              <p className="text-gray-500 mb-4">
                Owner: {selectedPet?.owner?.name || selectedPet?.ownerName || 'N/A'}
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm mb-2">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Diagnosis</th>
                      <th className="py-2 px-2">Prescription</th>
                      <th className="py-2 px-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : petHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          No patient history available for this pet
                        </td>
                      </tr>
                    ) : (
                      petHistory.map((report, index) => (
                        <tr key={report._id || index} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-2 align-top">
                            {formatDate(report.date)}
                          </td>
                          <td className="py-3 px-2 align-top">
                            {report.diagnosis || report.summary || 'N/A'}
                          </td>
                          <td className="py-3 px-2 align-top">
                            {report.prescription ? (
                              <div>{report.prescription}</div>
                            ) : report.medications && report.medications.length > 0 ? (
                              <div className="space-y-1">
                                {report.medications.map((med, i) => (
                                  <div key={i} className="text-xs">
                                    <span className="font-medium">{med.name}</span>
                                    {med.dosage && <span> - {med.dosage}</span>}
                                    {med.frequency && <span>, {med.frequency}</span>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="py-3 px-2 align-top">
                            <div className="max-w-xs">
                              {report.notes || 'No additional notes'}
                              {report.recommendations && report.recommendations.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <strong>Recommendations:</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {report.recommendations.map((rec, i) => (
                                      <li key={i}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientHistory;