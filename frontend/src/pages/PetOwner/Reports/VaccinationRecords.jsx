import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar } from 'lucide-react';

const VaccinationRecords = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => (
  <div className="flex h-screen bg-gray-50">
    <AppSidebar
      user={user}
      setCurrentView={setCurrentView}
      setUser={setUser}
      currentView={currentView}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
    <div className="flex-1 ml-0 l overflow-auto">
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Vaccination Records</h1>
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[200px]">
          <Calendar className="w-12 h-12 text-green-400 mb-4" />
          <p className="text-gray-500">Vaccination records will appear here.</p>
        </div>
      </div>
    </div>
  </div>
);

export default VaccinationRecords;