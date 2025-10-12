import { Brain, ArrowLeft } from 'lucide-react';

const Header = ({ onNavigateBack }) => {
  return (
   <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm flex-shrink-0 z-50 relative">
      <div className="px-6">
        <div className="flex items-center justify-between py-3">
          {/* Back button on far left */}
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-105 active:scale-95"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          {/* Logo and title in center */}
          <div className="flex items-center space-x-3 flex-1 justify-center">
            <div className="relative">
              <div className="p-2 bg-purple-200 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black">
               ChatBot
              </h1>
              <p className="text-xs text-gray-600 font-medium">Intelligent Assistant</p>
            </div>
          </div>
          
          {/* Right side spacer to balance the layout */}
          <div className="w-[42px]"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;