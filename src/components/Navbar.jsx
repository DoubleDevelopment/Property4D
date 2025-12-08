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
        ? 'bg-gray-900/95 border-amber-500/30' 
        : 'bg-white/95 border-amber-500/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="shrink-0">
              <h1 className={`text-3xl font-bold transition-colors duration-300 font-['Cinzel',serif] bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent`}>
                Conneckt
              </h1>
              <p className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                isDark ? 'text-amber-500/70' : 'text-amber-600/70'
              }`}>
                Global Real Estate Network
              </p>
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
                      ? 'text-gray-300 hover:text-amber-400 hover:bg-linear-to-r hover:from-amber-900/20 hover:to-yellow-900/20' 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-linear-to-r hover:from-amber-50 hover:to-yellow-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 border shadow-lg ${
                isDark 
                  ? 'bg-linear-to-br from-amber-900/30 to-yellow-900/20 border-amber-500/50 text-amber-400 hover:shadow-amber-500/20' 
                  : 'bg-linear-to-br from-amber-50 to-yellow-100 border-amber-500/50 text-amber-600 hover:shadow-amber-500/30'
              }`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 border shadow-lg ${
                isDark 
                  ? 'bg-linear-to-br from-amber-900/30 to-yellow-900/20 border-amber-500/50 text-amber-400' 
                  : 'bg-linear-to-br from-amber-50 to-yellow-100 border-amber-500/50 text-amber-600'
              }`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-amber-400 hover:bg-linear-to-r hover:from-amber-900/20 hover:to-yellow-900/20' 
                  : 'text-gray-700 hover:text-amber-600 hover:bg-linear-to-r hover:from-amber-50 hover:to-yellow-50'
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
