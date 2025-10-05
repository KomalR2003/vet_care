import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { BarChart3 } from 'lucide-react';

const DiseaseAnalysis = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => (
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Disease Analysis</h1>
        <p className="text-gray-600 mb-6">View most common pet diseases based on reports</p>
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-[200px]">
          <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
          <p className="text-gray-500">Disease analysis chart will appear here.</p>
        </div>
      </div>
    </div>
  </div>
);

export default DiseaseAnalysis;