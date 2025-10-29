import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { 
  FileText, 
  Heart, 
  Calendar, 
  Pill, 
  AlertCircle, 
  Activity,
  Syringe,
  Eye,
  X,
  User,
  PawPrint,
  ClipboardList
} from 'lucide-react';

const MedicalHistory = ({ user, pets, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pets
  const filteredPets = pets.filter(pet => {
    const matchesSpecies = filterSpecies === 'all' || pet.species?.toLowerCase() === filterSpecies.toLowerCase();
    const matchesSearch = !searchTerm || 
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  // Get unique species for filter
  const uniqueSpecies = [...new Set(pets.map(pet => pet.species))].filter(Boolean);

  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };

  const getHealthStatus = (pet) => {
    if (!pet.medical_history || pet.medical_history.length === 0) {
      return { status: 'healthy', color: 'green', text: 'Healthy' };
    }
    if (pet.medical_history.length > 3) {
      return { status: 'attention', color: 'yellow', text: 'Needs Attention' };
    }
    return { status: 'moderate', color: 'blue', text: 'Moderate Care' };
  };

  const MedicalDetailsModal = () => {
    if (!selectedPet) return null;

    const healthStatus = getHealthStatus(selectedPet);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">{selectedPet.name}'s Medical History</h2>
                  <p className="text-blue-100">{selectedPet.species} - {selectedPet.breed}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <PawPrint className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">{selectedPet.age}</span>
                </div>
                <p className="text-sm text-blue-700 font-medium">Years Old</p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-900">{selectedPet.weight || 'N/A'}</span>
                </div>
                <p className="text-sm text-purple-700 font-medium">Weight (kg)</p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-900">
                    {selectedPet.medical_history?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-yellow-700 font-medium">Medical Records</p>
              </div>

              <div className={`${
                healthStatus.status === 'healthy' ? 'bg-green-50 border-green-200' :
                healthStatus.status === 'attention' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              } border-2 rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <Heart className={`w-8 h-8 ${
                    healthStatus.status === 'healthy' ? 'text-green-600' :
                    healthStatus.status === 'attention' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <Activity className={`w-6 h-6 ${
                    healthStatus.status === 'healthy' ? 'text-green-600' :
                    healthStatus.status === 'attention' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <p className={`text-sm font-medium ${
                  healthStatus.status === 'healthy' ? 'text-green-700' :
                  healthStatus.status === 'attention' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>{healthStatus.text}</p>
              </div>
            </div>

            {/* Owner and Pet Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Owner Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-900 font-semibold">{selectedPet.owner?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900 text-xs">{selectedPet.owner?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-900">{selectedPet.owner?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <PawPrint className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Pet Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Species:</span>
                    <span className="text-gray-900 font-semibold">{selectedPet.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Breed:</span>
                    <span className="text-gray-900">{selectedPet.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Age:</span>
                    <span className="text-gray-900">{selectedPet.age} years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History Records */}
            {selectedPet.medical_history && selectedPet.medical_history.length > 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Medical History Records</h3>
                </div>
                <div className="space-y-3">
                  {selectedPet.medical_history.map((record, index) => (
                    <div key={index} className="bg-white border border-yellow-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-gray-800 leading-relaxed">{record}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <Heart className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Medical History</h3>
                <p className="text-gray-600">This pet has a clean medical record with no reported issues.</p>
              </div>
            )}

            {/* Vaccination Records */}
            {selectedPet.vaccinationRecords && selectedPet.vaccinationRecords.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Syringe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Vaccination Records</h3>
                </div>
                <div className="space-y-3">
                  {selectedPet.vaccinationRecords.map((vac, index) => (
                    <div key={index} className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Syringe className="w-5 h-5 text-purple-600 mr-2" />
                          <div>
                            <p className="font-semibold text-gray-900">{vac.vaccine}</p>
                            {vac.notes && <p className="text-sm text-gray-600 mt-1">{vac.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{new Date(vac.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allergies */}
            {selectedPet.allergies && selectedPet.allergies.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Known Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.allergies.map((allergy, index) => (
                    <span key={index} className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-300">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prescriptions */}
            {selectedPet.prescriptions && selectedPet.prescriptions.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Prescription History</h3>
                </div>
                <div className="space-y-3">
                  {selectedPet.prescriptions.map((prescription, index) => (
                    <div key={index} className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center flex-1">
                          <Pill className="w-5 h-5 text-blue-600 mr-2" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{prescription.medicine}</p>
                            {prescription.dosage && (
                              <p className="text-sm text-gray-600 mt-1">Dosage: {prescription.dosage}</p>
                            )}
                            {prescription.notes && (
                              <p className="text-sm text-gray-500 mt-1">{prescription.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{new Date(prescription.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6 rounded-b-2xl flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Last Updated: {new Date(selectedPet.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors"
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
      <div className="flex-1 ml-0 overflow-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical History</h1>
            </div>
            <p className="text-gray-600">Complete medical records and health history of all pets</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Pet</label>
                <input
                  type="text"
                  placeholder="Search by pet name, owner, or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Species</label>
                <select
                  value={filterSpecies}
                  onChange={(e) => setFilterSpecies(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Species</option>
                  {uniqueSpecies.map(species => (
                    <option key={species} value={species}>{species}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredPets.length} of {pets.length} pets
            </div>
          </div>

          {/* Medical History Cards */}
          {filteredPets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pets Found</h3>
              <p className="text-gray-600">No pets match your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => {
                const healthStatus = getHealthStatus(pet);
                return (
                  <div key={pet._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className={`${
                      healthStatus.status === 'healthy' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      healthStatus.status === 'attention' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-blue-500 to-blue-600'
                    } p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                            <p className="text-sm text-white text-opacity-90">{pet.species} - {pet.breed}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Owner:
                        </span>
                        <span className="font-medium text-gray-900">{pet.owner?.name || 'Unknown'}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Age:
                        </span>
                        <span className="font-medium text-gray-900">{pet.age} years</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          Weight:
                        </span>
                        <span className="font-medium text-gray-900">{pet.weight ? `${pet.weight} kg` : 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Records:
                        </span>
                        <span className="font-medium text-gray-900">{pet.medical_history?.length || 0}</span>
                      </div>

                      <div className="pt-3 border-t">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          healthStatus.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          healthStatus.status === 'attention' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          <Activity className="w-3 h-3 mr-1" />
                          {healthStatus.text}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(pet)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full History
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && <MedicalDetailsModal />}
    </div>
  );
};

export default MedicalHistory;