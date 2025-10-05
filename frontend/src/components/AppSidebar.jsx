import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Heart, 
  Calendar, 
  User, 
  LogOut,
  Menu,
  X,
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const AppSidebar = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  // State to track which parent menu is expanded
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Role-based navigation items
  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'user-management', 
          label: 'User Management', 
          icon: Users,
          subItems: [
            { id: 'manage-pet-owners', label: 'Manage Pet Owners' },
            { id: 'manage-doctors', label: 'Manage Doctors' }
          ]
        },
        { 
          id: 'appointment-oversight', 
          label: 'Appointment Oversight', 
          icon: Calendar,
        },
        { 
          id: 'pet-management', 
          label: 'Pet Management', 
          icon: Heart,
          subItems: [
            { id: 'all-pets', label: 'All Pets' },
            { id: 'medical-history', label: 'Medical History' }
          ]
        },
        { 
          id: 'reports-analytics', 
          label: 'Reports & Analytics', 
          icon: BarChart3,
        }     
      ];
    } else if (user?.role === 'doctor') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-appointments', label: 'My Appointments', icon: Calendar },
        { id: 'patient-history', label: 'Patient History', icon: FileText },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else if (user?.role === 'pet owner') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'pets',
          label: 'My Pets',
          icon: Heart,
          subItems: [
            { id: 'my-pets', label: 'All Pets' },
          ]
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: Calendar,
          subItems: [
            { id: 'my-appointments', label: 'My Appointments' },                      
          ]
        },
        {
          id: 'reports',
          label: 'Reports & Health',
          icon: FileText,
          subItems: [
            { id: 'health-records', label: 'Health Records' },
            { id: 'vaccination-records', label: 'Vaccination Records' },
            { id: 'prescriptions', label: 'Prescriptions' }
          ]
        }
      ];
    } else {
      // Default navigation (fallback)
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope },
        { id: 'pets', label: 'My Pets', icon: Heart },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleParentMenuClick = (menuId) => {
    if (expandedMenu === menuId) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menuId);
    }
  };

  // Check if a submenu item is currently active
  const isSubmenuActive = (subItems) => {
    return subItems?.some(subItem => subItem.id === currentView);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:z-auto w-64`}>
        {/* Header/Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">VetCare</h1>
              <p className="text-xs text-gray-500">Pet Health Management</p>
            </div> */}
             <img src={logo} alt="Logo" />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            NAVIGATION
          </h2>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isSubmenuExpanded = expandedMenu === item.id;
              const hasActiveSubmenu = isSubmenuActive(item.subItems);
              
              return (
                <div key={item.id}>
                  {item.subItems ? (
                    // Parent menu with submenu
                    <div>
                      <button
                        onClick={() => handleParentMenuClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive || hasActiveSubmenu
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {isSubmenuExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {/* Sub-items */}
                      {(isSubmenuExpanded || hasActiveSubmenu) && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => handleNavigation(subItem.id)}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentView === subItem.id
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              <span>{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular menu item without submenu
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-20 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name || 'John Doe'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;