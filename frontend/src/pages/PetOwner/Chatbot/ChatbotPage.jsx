import React, { useState, useEffect } from 'react';
import './ChatbotApp.css';
import ChatbotHeader from './components/ChatbotHeader';
import ChatSection from './components/ChatSection';
import ChatbotSidebar from './components/ChatbotSidebar'; 
import AdminPanel from './components/AdminPanel';
import { chatbotAPI } from '../../../api/api'; 

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function ChatbotApp() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // ✅ Create new session automatically ONLY once when the app starts
  useEffect(() => {
    if (!initialLoadDone) {
      handleNewChat();
      setInitialLoadDone(true);
    }
  }, [initialLoadDone]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  // ✅ Create a new chat session manually
   const handleNewChat = async () => {
    try {
      const response = await chatbotAPI.createNewChat('New Chat'); // ✅ Fixed
      const newSessionId = response.data.session_id;
      setMessages([]);
      setCurrentSessionId(newSessionId);
      setRefreshTrigger((prev) => prev + 1);

      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      clearChat();
    }
  };

  // ✅ Select an existing chat
   const handleSessionSelect = async (sessionId) => {
    if (sessionId === currentSessionId) return;

    setLoading(true);
    try {
      const response = await chatbotAPI.getChatSession(sessionId); // ✅ Fixed
      // ... rest same
    } catch (error) {
      console.error('Error loading session:', error);
      setMessages([]);
      setCurrentSessionId(null);
    } finally {
      setLoading(false);
    }
  };


  // ✅ When message is sent, refresh sidebar timestamps
  const handleMessageSent = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // ✅ When chat is deleted, do NOT create new one automatically
  const handleSessionDelete = (deletedSessionId) => {
    if (deletedSessionId === currentSessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
    // only refresh sidebar
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Admin Panel */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />

      {/* Main Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <ChatbotSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onClearChat={clearChat}
          onOpenAdminPanel={() => {
            setAdminPanelOpen(true);
            if (window.innerWidth < 1024) setSidebarOpen(false);
          }}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onSessionDelete={handleSessionDelete}
          refreshTrigger={refreshTrigger}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-24">
          {/* Header (mobile) */}
          <div className="lg:hidden">
            <ChatbotHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          </div>

          {/* Chat Section */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="h-full max-w-[77rem] mx-auto">
              <ChatSection
                messages={messages}
                onAddMessage={addMessage}
                currentSessionId={currentSessionId}
                onNewChat={handleNewChat}
                loading={loading}
                onMessageSent={handleMessageSent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotApp;