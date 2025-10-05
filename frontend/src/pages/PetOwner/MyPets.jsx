import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { Heart, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { petsAPI } from '../../api/api';

const MyPets = ({ 
  user, 
  pets = [], 
  setPets, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewPet = (pet) => {
    setSelectedPet(pet);
    setShowDetails(true);
  };

  const handleEditPet = (pet) => {
    // Navigate to edit pet page
    setCurrentView('edit-pet');
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petsAPI.deletePet(petId);
        // Remove pet from local state
        setPets(pets.filter(pet => pet._id !== petId));
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert('Failed to delete pet. Please try again.');
      }
    }
  };

  const handleAddPet = () => {
    setCurrentView('add-pet');
  };

  // Pet Details Modal
  const PetDetailsModal = () => {
    if (!selectedPet) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pet Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Pet Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPet.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{selectedPet.breed}</p>
                  <p className="text-sm text-gray-500">{selectedPet.species}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="text-gray-900">{selectedPet.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender:</span>
                      <span className="text-gray-900">{selectedPet.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight:</span>
                      <span className="text-gray-900">{selectedPet.weight || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color:</span>
                      <span className="text-gray-900">{selectedPet.color || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Health Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Health Status:</span>
                      <span className="text-green-600 font-medium">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Checkup:</span>
                      <span className="text-gray-900">2 weeks ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vaccinations:</span>
                      <span className="text-gray-900">Up to date</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedPet.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Notes</h4>
                  <p className="text-gray-900">{selectedPet.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setShowDetails(false);
                  handleEditPet(selectedPet);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Pet
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">My Pets</h1>
              <p className="text-gray-600">Manage your registered pets</p>
            </div>
            <button
              onClick={handleAddPet}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Pet
            </button>
          </div>

          {/* Pets Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pets.length === 0 ? (
                    <tr>
                                             <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Heart className="w-12 h-12 text-gray-400 mb-2" />
                          <p>No pets found</p>
                          <button
                            onClick={handleAddPet}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Add your first pet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pets.map((pet) => (
                      <tr key={pet._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                              <div className="text-sm text-gray-500">ID: {pet._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.species}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.breed}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.age} years</td>
                        
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewPet(pet)}
                              className="text-blue-600 hover:text-blue-900 p-1" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPet(pet)}
                              className="text-green-600 hover:text-green-900 p-1" 
                              title="Edit Pet"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePet(pet._id)}
                              className="text-red-600 hover:text-red-900 p-1" 
                              title="Delete Pet"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {/* Pet Details Modal */}
      {showDetails && <PetDetailsModal />}
    </div>
  );
};

export default MyPets;
