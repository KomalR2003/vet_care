import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { User, Phone, Eye, Calendar, Heart } from 'lucide-react';

const ManagePetOwners = ({ 
  user, 
  pets, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const [selectedPetOwner, setSelectedPetOwner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewProfile = (petOwner) => {
    setSelectedPetOwner(petOwner);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPetOwner(null);
  };

  // Group pets by owner to create pet owners list
  const getPetOwners = () => {
    const petOwnersMap = {};
    
    pets.forEach(pet => {
      if (pet.owner) {
        if (!petOwnersMap[pet.owner._id]) {
          petOwnersMap[pet.owner._id] = {
            _id: pet.owner._id,
            name: pet.owner.name,
            email: pet.owner.email,
            phone: pet.owner.phone,
            totalPets: 0,
            pets: []
          };
        }
        petOwnersMap[pet.owner._id].pets.push(pet);
        petOwnersMap[pet.owner._id].totalPets++;
      }
    });
    
    return Object.values(petOwnersMap);
  };

  const petOwners = getPetOwners();

  // Pet Owner Details Modal
  const PetOwnerDetailsModal = () => {
    if (!selectedPetOwner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pet Owner Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Pet Owner Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPetOwner.name}</h3>
                  <p className="text-lg text-green-600 font-medium">Pet Owner</p>
                  <p className="text-sm text-gray-500">Total Pets: {selectedPetOwner.totalPets}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900">{selectedPetOwner.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedPetOwner.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Pet Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-gray-900">{selectedPetOwner.totalPets} Pets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-900">Member since: {new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pets List */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Registered Pets</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPetOwner.pets.map((pet, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.species}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.breed}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.age} years</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6 pt-6 border-t">
              <button
                onClick={handleCloseDetails}
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
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Manage Pet Owners</h1>
            <p className="text-gray-600">View pet owner profiles and their registered pets</p>
          </div>

          {/* Pet Owners Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {petOwners.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No pet owners found
                      </td>
                    </tr>
                  ) : (
                    petOwners.map((petOwner) => (
                    <tr key={petOwner._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{petOwner.name}</div>
                            <div className="text-sm text-gray-500">ID: {petOwner._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{petOwner.email}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {petOwner.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{petOwner.totalPets} pets</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewProfile(petOwner)}
                          className="text-blue-600 hover:text-blue-900 p-1" 
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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

      {/* Pet Owner Details Modal */}
      {showDetails && <PetOwnerDetailsModal />}
    </div>
  );
};

export default ManagePetOwners;