import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { User, Phone, Eye, Calendar, Heart, Edit, Trash2, X, Save } from 'lucide-react';

const ManagePetOwners = ({ 
  user, 
  pets, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen,
  refreshPets 
}) => {
  const [selectedPetOwner, setSelectedPetOwner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewProfile = (petOwner) => {
    setSelectedPetOwner(petOwner);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPetOwner(null);
  };

  const handleEditOwner = (petOwner) => {
    setEditingOwner({
      _id: petOwner._id,
      name: petOwner.name || '',
      email: petOwner.email || '',
      phone: petOwner.phone || '',
      role: petOwner.role || 'pet owner'
    });
    setShowEditModal(true);
  };

  const handleInputChange = (field, value) => {
    setEditingOwner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${editingOwner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingOwner.name,
          email: editingOwner.email,
          phone: editingOwner.phone,
          role: editingOwner.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      alert('Pet owner updated successfully!');
      setShowEditModal(false);
      setEditingOwner(null);
      if (refreshPets) await refreshPets();
    } catch (error) {
      console.error('Error updating pet owner:', error);
      alert(error.message || 'Failed to update pet owner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOwner = async (petOwner) => {
    if (!window.confirm(`Are you sure you want to delete ${petOwner.name}? This will also delete all their pets!`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${petOwner._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      alert('Pet owner deleted successfully!');
      if (refreshPets) await refreshPets();
    } catch (error) {
      console.error('Error deleting pet owner:', error);
      alert('Failed to delete pet owner. Please try again.');
    }
  };

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
            role: pet.owner.role || 'pet owner',
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

  const EditOwnerModal = () => {
    if (!editingOwner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Pet Owner</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={editingOwner.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={editingOwner.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={editingOwner.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editingOwner.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pet owner">Pet Owner</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PetOwnerDetailsModal = () => {
    if (!selectedPetOwner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pet Owner Details</h2>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-6">
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

              <div>
                <h4 className="font-medium text-gray-700 mb-3">Registered Pets</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPetOwner.pets.map((pet, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{pet.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.species}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.breed}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{pet.age} years</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <button onClick={handleCloseDetails} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
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
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Manage Pet Owners</h1>
            <p className="text-gray-600">View, edit, and manage pet owner profiles</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {petOwners.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No pet owners found</td>
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
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewProfile(petOwner)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded" 
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditOwner(petOwner)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded" 
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteOwner(petOwner)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded" 
                              title="Delete"
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

      {showDetails && <PetOwnerDetailsModal />}
      {showEditModal && <EditOwnerModal />}
    </div>
  );
};

export default ManagePetOwners;