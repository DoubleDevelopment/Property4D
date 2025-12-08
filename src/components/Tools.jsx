import { ChevronRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Globe as GlobeIcon, Calculator, Eye, Activity, Filter, DollarSign } from 'lucide-react';

export default function Tools() {
  const { isDark } = useDarkMode();

  const tools = [
    {
      icon: GlobeIcon,
      title: '4D Property Globe',
      description: 'Interactive 3D globe with real-time property listings, market trends, and transaction visualizations.',
      features: ['Live listings', 'Market heatmaps', 'Transaction tracking', 'Area comparisons']
    },
    {
      icon: Calculator,
      title: 'Investment Calculator',
      description: 'Advanced ROI calculations with mortgage affordability, rental yields, and appreciation forecasts.',
      features: ['ROI analysis', 'Mortgage calculator', 'Rental yield', 'Appreciation models']
    },
    {
      icon: Eye,
      title: 'Virtual Tours',
      description: 'Immersive 360° property tours with augmented reality staging and neighborhood exploration.',
      features: ['360° tours', 'AR staging', 'Neighborhood view', 'Virtual furniture']
    },
    {
      icon: Activity,
      title: 'Market Analytics',
      description: 'Real-time market data, price trends, and predictive analytics for informed decisions.',
      features: ['Live market data', 'Price trends', 'Predictive analytics', 'Competitor analysis']
    },
    {
      icon: Filter,
      title: 'Smart Search',
      description: 'AI-powered property matching with advanced filters and personalized recommendations.',
      features: ['AI matching', 'Advanced filters', 'Personalized results', 'Saved searches']
    },
    {
      icon: DollarSign,
      title: 'Price Comparison',
      description: 'Compare property prices across different areas with detailed cost breakdowns and valuations.',
      features: ['Area comparison', 'Price history', 'Valuation tools', 'Cost breakdown']
    }
  ];

  return (
    <section className={`py-24 transition-all duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold mb-6 font-serif transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Powerful <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Tools</span>
          </h2>
          <p className={`text-xl max-w-4xl mx-auto font-serif leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comprehensive suite of real estate tools designed to complement our 4D globe and 
            transform your property search and investment decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className={`group rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 ${
              isDark 
                ? 'bg-gray-800 border-2 border-yellow-600/30 hover:border-yellow-600/50' 
                : 'bg-white border-2 border-gray-200 hover:border-yellow-600/50 shadow-lg hover:shadow-xl'
            }`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                <tool.icon className={`h-8 w-8 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-4 font-serif transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{tool.title}</h3>
              <p className={`mb-6 font-serif leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center text-sm font-serif ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <ChevronRight className={`h-4 w-4 mr-2 shrink-0 ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
