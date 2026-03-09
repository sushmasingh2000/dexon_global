import { useNavigate } from 'react-router-dom';
import logo from '../assets/tradeforyou.png';
const Footer = ({ darkMode, faq }) => {
    const navigate = useNavigate();

    const scrollToTopAndNavigate = (path) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => navigate(path), 300);
    };

    return (
        <footer className={`py-12 lg:px-6 px-2 ${darkMode ? 'bg-black border-t border-gray-800' : 'bg-gray-900 text-white'}`}>
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="sm:text-center">
                        {/* <div className="flex sm:justify-center items-center space-x-2 mb-4"> */}
                        <div className="flex items-center space-x-2 h-20 w-20">
                            <img src={logo} alt="dexon.global Logo" />
                        </div>
                        <span className="text-xl font-bold">DexonGlobal</span>
                        {/* </div> */}
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-300'}>
                            Secure crypto trading platform powered by blockchain technology.
                        </p>
                    </div>
                    <div className="sm:!text-center">
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 sm:flex sm:flex-col sm:items-center">
                            <li><a href="/" onClick={(e) => { e.preventDefault(); scrollToTopAndNavigate('/'); }} className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Home</a></li>
                            <li><a href="#" className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>About Us</a></li>
                            <li><a href="#" className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Services</a></li>
                            <li><a href="#" className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Contact</a></li>
                        </ul>
                    </div>
                    <div className="sm:text-center">
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Help Center</a></li>
                            <li><button onClick={() => scrollToTopAndNavigate('/privacy-policy')} className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Privacy Policy</button></li>
                            <li><button onClick={() => scrollToTopAndNavigate('/terms-and-conditions')} className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Terms of Service</button></li>
                            <li><button onClick={() => scrollToTopAndNavigate('/cookie-policy')} className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}>Cookie Policy</button></li>
                            <li><a href="#" className={`${darkMode ? 'text-gray-400 hover:text-purple-500' : 'text-gray-300 hover:text-purple-400'} transition`}

                                onClick={(e) => {
                                    if (faq) {
                                        e.preventDefault();
                                        faq.current?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}>FAQ</a></li>
                        </ul>
                    </div>
                    <div className="sm:text-center">
                        <h4 className="font-semibold mb-4">Newsletter</h4>
                        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>Stay updated with crypto news</p>
                        <div className="flex sm:justify-center gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-600'}`}
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">→</button>
                        </div>
                    </div>
                </div>
                <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-700'} text-center ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
                    <p>Copyright © 2026 DexonGlobal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
