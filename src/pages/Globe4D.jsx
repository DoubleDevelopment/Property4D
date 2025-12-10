import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';


export default function Globe4D() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className={`w-full h-screen relative ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 border border-amber-500/30"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-['Cinzel',serif]">Back to Home</span>
      </button>

      {/* Title overlay */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-['Cinzel',serif] bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
          Globe 4D Demo
        </h1>
        <p className="text-sm text-amber-500/80 font-['Trajan_Pro',serif] tracking-widest uppercase mt-2">
          Time, Weather & Future Features (Coming Soon)
        </p>
      </div>

      {/* Placeholder content */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <p className={`text-lg md:text-xl font-serif leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-200'
          }`}>
            The Globe 4D experience will bring dynamic time-of-day, weather overlays, and
            evolving cityscapes to life. This is a preview route wired for navigation
            while the core 4D engine is under construction.
          </p>
        </div>
      </div>
    </div>
  );
}

