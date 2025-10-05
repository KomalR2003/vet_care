import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { PawPrint, User } from 'lucide-react';

const AllPets = ({ user, pets, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => (
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">All Pets</h1>
        <p className="text-gray-600 mb-6">View all pets registered in the system</p>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No pets found
                  </td>
                </tr>
              ) : (
                pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap flex items-center">
                    <PawPrint className="w-5 h-5 text-blue-500 mr-2" />
                    {pet.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                     {pet.owner?.name || pet.owner?.email || "Unknown"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{pet.species}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{pet.breed}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{pet.age}</td>
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

export default AllPets;