import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Footer() {
  const { isDark } = useDarkMode();

  return (
    <footer className={`transition-all duration-300 ${
      isDark 
        ? 'bg-linear-to-b from-gray-800 to-gray-900 text-white' 
        : 'bg-linear-to-b from-gray-100 to-gray-200 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4 font-['Cinzel',serif]">
                <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Conneckt
                </span>
              </h3>
              <div className={`text-sm font-['Trajan_Pro',serif] tracking-widest uppercase mb-4 ${
                isDark ? 'text-yellow-600/70' : 'text-yellow-700/70'
              }`}>
                Global Real Estate Network
              </div>
              <div className={`absolute -top-2 -left-2 w-16 h-16 border-2 ${
                isDark ? 'border-yellow-600/30' : 'border-yellow-600/50'
              }`} />
              <div className={`absolute -bottom-2 -right-2 w-16 h-16 border-2 ${
                isDark ? 'border-yellow-600/30' : 'border-yellow-600/50'
              }`} />
            </div>
            <p className={`mb-6 max-w-md font-serif leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Transforming real estate visualization with cutting-edge technology. 
              Experience properties like never before with our innovative 4D analysis and search tools.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isDark 
                      ? 'border-yellow-600/30 text-yellow-400 hover:bg-yellow-900/20 hover:border-yellow-600/50' 
                      : 'border-yellow-600/50 text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-semibold mb-6 font-serif ${
              isDark ? 'text-yellow-400' : 'text-yellow-700'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Tools', 'Services'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className={`transition-colors duration-200 font-serif ${
                      isDark 
                        ? 'text-gray-300 hover:text-yellow-400' 
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-2xl font-bold mb-4 font-['Cinzel',serif] ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Conneckt
            </h3>
            <p className={`text-sm mb-4 font-serif ${
              isDark ? 'text-yellow-600/70' : 'text-yellow-700/70'
            }`}>
              Global Real Estate Network
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className={`h-5 w-5 shrink-0 mt-1 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  123 Real Estate Plaza<br />
                  Property District, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 shrink-0 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className={`h-5 w-5 shrink-0 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  info@conneckt.com
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-semibold mb-6 font-serif ${
              isDark ? 'text-yellow-400' : 'text-yellow-700'
            }`}>
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className={`h-5 w-5 shrink-0 mt-1 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  123 Real Estate Plaza<br />
                  Property District, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 shrink-0 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className={`h-5 w-5 shrink-0 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-serif ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  info@conneckt.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t mt-12 pt-8 text-center font-serif text-sm ${
          isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'
        }`}>
          <p>
            © 2024 Conneckt. All rights reserved. | 
            <a href="#" className={`ml-1 transition-colors ${
              isDark ? 'hover:text-yellow-400' : 'hover:text-yellow-600'
            }`}>Privacy Policy</a> | 
            <a href="#" className={`ml-1 transition-colors ${
              isDark ? 'hover:text-yellow-400' : 'hover:text-yellow-600'
            }`}>Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
