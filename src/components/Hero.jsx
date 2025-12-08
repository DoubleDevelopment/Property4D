import { useState, useEffect } from 'react';
import SideGlobe from './SideGlobe';
import { ArrowRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const { isDark } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isDark 
            ? 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-linear-to-br from-gray-50 via-white to-gray-100'
        }`}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      
      <SideGlobe />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Headers */}
          <div className="text-left">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 font-serif transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to
              <span className="block bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mt-4">
                Property4D
              </span>
            </h1>
            <div className={`text-xl md:text-2xl font-serif tracking-wide mb-8 uppercase ${
              isDark ? 'text-yellow-600/70' : 'text-yellow-700/70'
            }`}>
              Roman Real Estate Excellence
            </div>
            <p className={`text-lg md:text-xl mb-12 max-w-2xl font-serif leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience property discovery through our majestic Roman statue globe. 
              Where ancient architectural wisdom meets modern real estate technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-linear-to-r from-yellow-500 to-yellow-600 text-white px-10 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className={`border-2 px-10 py-4 rounded-lg font-semibold transition-all duration-300 font-serif hover:transform hover:-translate-y-1 ${
                isDark 
                  ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-900/20' 
                  : 'border-yellow-600 text-yellow-600 hover:bg-yellow-50'
              }`}>
                View Globe Demo
              </button>
            </div>
          </div>
          
          {/* Right side - Empty space for globe visibility */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
}
