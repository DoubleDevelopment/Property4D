import DeckGlobe from "../sections/deck/DeckGlobe";
import { sampleProperties } from "../sections/deck/data/sampleProperties";
import { useDarkMode } from '../contexts/DarkModeContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobePage() {
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
          Interactive Globe
        </h1>
        <p className="text-sm text-amber-500/80 font-['Trajan_Pro',serif] tracking-widest uppercase mt-2">
          Explore Properties Worldwide
        </p>
      </div>

      {/* DeckGL Globe */}
      <DeckGlobe 
        properties={sampleProperties}
        showArcs={true}
        showHeatmap={true}
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  );
}