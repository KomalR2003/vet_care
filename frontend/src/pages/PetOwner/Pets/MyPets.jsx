import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Heart, Edit, Trash2, Eye, PawPrint } from 'lucide-react';

const MyPets = ({ user, pets, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
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
      <div className="flex-1 ml-0  overflow-auto">
        <div className="p-4 lg:p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Pets</h1>
            <button
              onClick={() => setCurrentView('add-pet')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Heart className="w-5 h-5 mr-2" />
              Add New Pet
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
           <table className="w-full">
          <thead className="bg-gray-50">
  <tr>
    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
  {pets.length === 0 ? (
    <tr>
      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
        No pets found
      </td>
    </tr>
  ) : (
    pets.map((pet) => (
      <tr key={pet.id} className="hover:bg-gray-50">
        <td className="px-10 py-4 whitespace-nowrap flex items-center">
          <PawPrint className="w-5 h-5 text-blue-500 mr-2" />
          {pet.name}
        </td>
       
        <td className="px-10  whitespace-nowrap">{pet.species}</td>
        <td className="px-10  whitespace-nowrap">{pet.breed}</td>
        <td className="px-10  whitespace-nowrap">{pet.age}</td>

        <td className="px-10  whitespace-nowrap flex space-x-3">
          <Eye className="w-5 h-5  cursor-pointer text-blue-600" />
          <Trash2 className="w-5 h-5  cursor-pointer text-red-600" />
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
  );
};

export default MyPets;