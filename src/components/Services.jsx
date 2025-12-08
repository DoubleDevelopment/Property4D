import { Building, TrendingUp, Shield, Users } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Services() {
  const { isDark } = useDarkMode();

  const services = [
    {
      icon: Building,
      title: 'Property Listings',
      description: 'Comprehensive property database with detailed listings, photos, and virtual tours.',
      price: 'Free for Buyers'
    },
    {
      icon: TrendingUp,
      title: 'Market Reports',
      description: 'In-depth market analysis and investment opportunities with expert insights.',
      price: 'Starting at $99'
    },
    {
      icon: Shield,
      title: 'Premium Verification',
      description: 'Verified property listings with legal compliance and authenticity guarantees.',
      price: 'Starting at $199'
    },
    {
      icon: Users,
      title: 'Agent Network',
      description: 'Connect with certified real estate agents and property professionals.',
      price: 'Contact Us'
    }
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
            Our <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className={`text-xl max-w-4xl mx-auto font-serif leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Professional real estate services tailored to meet your specific property needs 
            with cutting-edge technology integration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className={`group rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 ${
              isDark 
                ? 'bg-gray-900/50 border-2 border-yellow-600/30 hover:border-yellow-600/50' 
                : 'bg-white border-2 border-gray-200 hover:border-yellow-600/50 shadow-lg hover:shadow-xl'
            }`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                <service.icon className={`h-8 w-8 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-4 font-serif transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{service.title}</h3>
              <p className={`mb-6 font-serif leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{service.description}</p>
              <div className={`font-semibold mb-6 ${
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`}>{service.price}</div>
              <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 font-serif hover:transform hover:-translate-y-1 ${
                isDark 
                  ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 border border-yellow-600/50' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
