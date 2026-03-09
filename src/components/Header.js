import { Menu, Moon, Sun, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
const Header = ({ darkMode, setDarkMode, mobileMenuOpen, setMobileMenuOpen }) => {
    const toggleTheme = () => setDarkMode(!darkMode);
    const naqigate = useNavigate();
    return (
        <header className={`fixed w-full top-0 z-50 backdrop-blur-md ${darkMode ? 'bg-black/80 border-b border-gray-800' : 'bg-white/80 border-b border-gray-200'}`}>
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 h-20 w-20">
                        <img src={logo} alt="DexonGlobal Logo" onClick={() => naqigate("/")} />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className={`hover:text-purple-500 transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>HOME</a>
                        <a href="#about" className={`hover:text-purple-500 transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>ABOUT US</a>
                        <a href="#solutions" className={`hover:text-purple-500 transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>OUR SOLUTIONS</a>
                        <a href="#contact" className="text-purple-500">CONTACT</a>
                    </div>

                    {/* Right Side - Theme Toggle & CTA */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>

                        {/* Sign In Button */}
                        <button
                            onClick={() => naqigate("/login")}
                            className="hidden md:block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                            SIGN IN
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className={`md:hidden mt-4 pb-4 space-y-3 ${darkMode ? 'bg-gray-900/50' : 'bg-white/50'} rounded-lg p-4`}>
                        <a href="/" className="block hover:text-purple-500 transition">HOME</a>
                        <a href="#about" className="block hover:text-purple-500 transition">ABOUT US</a>
                        <a href="#solutions" className="block hover:text-purple-500 transition">OUR SOLUTIONS</a>
                        <a href="#contact" className="block text-purple-500">CONTACT</a>
                        <button className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold"
                            onClick={() => naqigate("/login")}
                        >
                            SIGN IN
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
