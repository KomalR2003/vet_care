import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import AdminPanel from './AdminPanel';

const ChatbotAdminPanel = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
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
      
      <div className="flex-1 overflow-hidden">
        {/* AdminPanel always open */}
        <AdminPanel 
          isOpen={true} 
          onClose={() => setCurrentView('dashboard')} 
        />
      </div>
    </div>
  );
};

export default ChatbotAdminPanel;