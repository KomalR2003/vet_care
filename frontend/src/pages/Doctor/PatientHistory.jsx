import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { FileText, Search, Eye, XCircle } from 'lucide-react';

const PatientHistory = ({
  user, appointments = [], pets = [], setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewHistory = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
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
      <main className="flex-1 ml-0  p-6 overflow-auto">
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
                      <td className="py-2">{pet.ownerName}</td>
                      <td className="py-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center" onClick={() => handleViewHistory(pet)}> <Eye className="w-4 h-4 mr-1" /> View History </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Popup Modal for Patient History */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative min-h-[400px]">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeModal}
                title="Close"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Patient History for {selectedPet?.name}</h2>
              <p className="text-gray-500 mb-4">Owner: {selectedPet?.ownerName || 'N/A'}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm mb-2">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2">Date</th>
                      <th className="py-2">Diagnosis</th>
                      <th className="py-2">Prescription</th>
                      <th className="py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No patient history available for this pet
                      </td>
                    </tr>
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