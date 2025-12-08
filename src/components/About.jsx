import { Star, Clock, Users } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function About() {
  const { isDark } = useDarkMode();

  const stats = [
    { value: '50K+', label: 'Active Listings' },
    { value: '100+', label: 'Cities Covered' },
    { value: '2M+', label: 'Monthly Users' },
    { value: '24/7', label: 'Support Available' }
  ];

  return (
    <section className={`py-24 transition-all duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold mb-6 font-serif transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            About <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Property4D</span>
          </h2>
          <p className={`text-xl max-w-4xl mx-auto font-serif leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're crafting the future of real estate with our majestic Roman statue globe, 
            where timeless architectural mastery meets cutting-edge property technology and golden continents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className={`text-3xl font-bold mb-6 font-serif transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Our Mission</h3>
            <p className={`mb-6 font-serif leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              To empower buyers, sellers, and agents with cutting-edge technology that makes 
              real estate transactions transparent, efficient, and data-driven.
            </p>
            <p className={`mb-8 font-serif leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our platform combines advanced 4D mapping, real-time market data, and predictive 
              analytics to provide unprecedented insights into property markets worldwide.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-900/50 border-yellow-600/30' 
                    : 'bg-white border-yellow-600/50 shadow-sm'
                }`}>
                  <div className="text-3xl font-bold bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className={`text-sm font-serif mt-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`p-8 rounded-2xl relative overflow-hidden transition-all duration-300 ${
            isDark 
              ? 'bg-linear-to-br from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-600/30' 
              : 'bg-linear-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-600/50'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 border-4 border-yellow-600/20 transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-yellow-600/20 transform -translate-x-12 translate-y-12" />
            
            <div className="relative space-y-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                }`}>
                  <Star className={`h-6 w-6 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold text-lg font-serif mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Innovation First</h4>
                  <p className={`font-serif ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Leading real estate technology with groundbreaking 4D visualization
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                }`}>
                  <Clock className={`h-6 w-6 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold text-lg font-serif mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Timeless Design</h4>
                  <p className={`font-serif ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Blending classical architectural principles with modern technology
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                }`}>
                  <Users className={`h-6 w-6 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold text-lg font-serif mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Expert Collaboration</h4>
                  <p className={`font-serif ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Dedicated team of real estate professionals and technology experts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
