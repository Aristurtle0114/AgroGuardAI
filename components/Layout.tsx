
import React from 'react';
import { User, Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  theme: Theme;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onToggleTheme: () => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, theme, onLogout, onNavigate, onToggleTheme, currentPage }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-leaf text-xl"></i>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AgroGuard AI</span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            {user && (
              <nav className="hidden md:flex space-x-8">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => onNavigate('detect')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'detect' ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'}`}
                >
                  New Detection
                </button>
                <button 
                  onClick={() => onNavigate('chat')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'chat' ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'}`}
                >
                  Chat Expert
                </button>
              </nav>
            )}

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={onToggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Toggle Theme"
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
              </button>

              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:inline text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
                    ID: {user.ticket_code}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Exit Session"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onNavigate('ticket')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Access Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
          <div className="flex justify-around items-center h-16">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`flex flex-col items-center space-y-1 ${currentPage === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-house"></i>
              <span className="text-[10px]">Home</span>
            </button>
            <button 
              onClick={() => onNavigate('detect')}
              className={`flex flex-col items-center space-y-1 ${currentPage === 'detect' ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-plus-circle text-xl"></i>
              <span className="text-[10px]">Detect</span>
            </button>
            <button 
              onClick={() => onNavigate('chat')}
              className={`flex flex-col items-center space-y-1 ${currentPage === 'chat' ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-comments"></i>
              <span className="text-[10px]">Chat</span>
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center space-y-1 ${currentPage === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <i className="fa-solid fa-user"></i>
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
