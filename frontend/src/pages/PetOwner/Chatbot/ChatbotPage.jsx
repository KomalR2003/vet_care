import React, { useState, useEffect } from 'react';
import ChatbotHeader from './ChatbotHeader';
import ChatSection from './ChatSection';
import ChatbotSidebar from './ChatbotSidebar';
import AdminPanel from './AdminPanel';
import { chatbotAPI } from '../../../api/api'; 

function ChatbotApp({ setCurrentView }) {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Create new session automatically ONLY once when the app starts
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

  // ✅ BACK TO DASHBOARD FUNCTION
  const handleNavigateBack = () => {
    console.log('Back button clicked!'); 
    if (setCurrentView) {
      console.log('Navigating to dashboard'); 
      setCurrentView('dashboard');
    } else {
      console.error('setCurrentView prop not provided!');
      alert('Navigation not configured. Please pass setCurrentView prop to ChatbotApp');
    }
  };

  // Create a new chat session manually
  const handleNewChat = async () => {
    try {
      const response = await chatbotAPI.createNewChat('New Chat');
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

  // Select an existing chat
  const handleSessionSelect = async (sessionId) => {
    if (sessionId === currentSessionId) return;

    setLoading(true);
    try {
      const response = await chatbotAPI.getChatSession(sessionId);
      const sessionData = response.data;
      
      // Load messages from session
      if (sessionData.messages && Array.isArray(sessionData.messages)) {
        setMessages(sessionData.messages);
      } else {
        setMessages([]);
      }
      
      setCurrentSessionId(sessionId);
      
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      setMessages([]);
      setCurrentSessionId(null);
    } finally {
      setLoading(false);
    }
  };

  // When message is sent, refresh sidebar timestamps
  const handleMessageSent = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // When chat is deleted
  const handleSessionDelete = (deletedSessionId) => {
    if (deletedSessionId === currentSessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
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
        <div className="flex-1 flex flex-col lg:ml-28">
          
          {/* ✅ Only show header when admin panel is NOT open */}
          {!adminPanelOpen && (
            <ChatbotHeader 
              onNavigateBack={handleNavigateBack}
            />
          )}

          {/* Chat Section */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-[85rem] mx-auto px-5">
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