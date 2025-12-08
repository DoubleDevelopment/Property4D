import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideGlobe from './SideGlobe';
import { ArrowRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Hero() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();

  return (
    <section id="home" className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-linear-to-b from-gray-900 via-black to-gray-900' 
        : 'bg-linear-to-b from-gray-100 via-gray-50 to-white'
    }`}>
      {/* Dark space overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/30 pointer-events-none z-0" />
      
      {/* Starfield effect for dark mode */}
      {isDark && (
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0" 
             style={{
               backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent)',
               backgroundSize: '200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px',
               backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 150px 50px'
             }}
        />
      )}
      
      <SideGlobe />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Headers */}
          <div className="text-left">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 font-['Cinzel',serif] transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to
              <span className="block bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mt-4 drop-shadow-lg">
                Property Kinect
              </span>
            </h1>
            <div className={`text-xl md:text-2xl font-['Trajan_Pro',serif] tracking-wide mb-8 uppercase ${
              isDark ? 'text-amber-500/80' : 'text-amber-600/80'
            }`}>
              Global Real Estate Network
            </div>
            <p className={`text-lg md:text-xl mb-12 max-w-2xl font-serif leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience property discovery through our majestic globe. 
              Where ancient wisdom meets modern real estate technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-10 py-4 rounded-lg font-semibold hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 transform hover:-translate-y-1">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/globe')}
                className={`border-2 px-10 py-4 rounded-lg font-semibold transition-all duration-300 font-serif hover:transform hover:-translate-y-1 shadow-md ${
                  isDark 
                    ? 'border-amber-500 text-amber-400 hover:bg-linear-to-r hover:from-amber-900/20 hover:to-yellow-900/20 hover:shadow-amber-500/30' 
                    : 'border-amber-500 text-amber-600 hover:bg-linear-to-r hover:from-amber-50 hover:to-yellow-50 hover:shadow-amber-500/20'
                }`}
              >
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
