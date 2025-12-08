import { useState } from 'react';
import { Menu, X, Home, Info, Wrench, Briefcase, Phone, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  const navItems = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'About', icon: Info, href: '#about' },
    { name: 'Tools', icon: Wrench, href: '#tools' },
    { name: 'Services', icon: Briefcase, href: '#services' },
    { name: 'Contact', icon: Phone, href: '#footer' },
  ];

  return (
    <nav className={`fixed top-0 w-full backdrop-blur-sm shadow-lg z-50 border-b-2 transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900/95 border-yellow-600/30' 
        : 'bg-white/95 border-yellow-600/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Property4D
                </span>
              </h1>
              <div className={`text-xs mt-1 font-serif tracking-widest uppercase ${
                isDark ? 'text-yellow-600/70' : 'text-yellow-700/70'
              }`}>
                Real Estate Revolution
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-serif ${
                    isDark 
                      ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-900/20' 
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 border ${
                isDark 
                  ? 'bg-yellow-900/20 border-yellow-600/50 text-yellow-400 hover:bg-yellow-900/30' 
                  : 'bg-yellow-50 border-yellow-600/50 text-yellow-600 hover:bg-yellow-100'
              }`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 border ${
                isDark 
                  ? 'bg-yellow-900/20 border-yellow-600/50 text-yellow-400' 
                  : 'bg-yellow-50 border-yellow-600/50 text-yellow-600'
              }`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-900/20' 
                  : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden border-t-2 transition-all duration-300 ${
          isDark 
            ? 'bg-gray-900 border-yellow-600/30' 
            : 'bg-white border-yellow-600/50'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 font-serif ${
                  isDark 
                    ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-900/20' 
                    : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
