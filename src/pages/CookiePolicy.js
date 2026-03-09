import React, { useState } from 'react';
import { ChevronUp, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiePolicy = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const navigate = useNavigate();

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const sections = [
        {
            title: "1. What Are Cookies?",
            content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners."
        },
        {
            title: "2. How We Use Cookies",
            content: "DexonGlobal uses cookies to enhance your experience on our Platform. We use cookies for the following purposes:\n• Essential Cookies: Required for the Platform to function properly\n• Authentication: To keep you logged in and maintain your session\n• Preferences: To remember your settings and preferences\n• Analytics: To understand how visitors use our Platform\n• Security: To protect against fraud and unauthorized access"
        },
        {
            title: "3. Types of Cookies We Use",
            subsections: [
                {
                    subtitle: "3.1 Strictly Necessary Cookies",
                    content: "These cookies are essential for the Platform to function and cannot be switched off. They are usually set in response to actions made by you, such as setting privacy preferences or logging in."
                },
                {
                    subtitle: "3.2 Performance Cookies",
                    content: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Platform. They help us understand which pages are most popular and how visitors move around the site."
                },
                {
                    subtitle: "3.3 Functionality Cookies",
                    content: "These cookies enable the Platform to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages."
                },
                {
                    subtitle: "3.4 Targeting Cookies",
                    content: "These cookies may be set through our Platform by our advertising partners. They may be used to build a profile of your interests and show you relevant content on other sites."
                }
            ]
        },
        {
            title: "4. Third-Party Cookies",
            content: "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Platform and deliver advertisements. These third parties may set their own cookies to collect information about your online activities across different websites."
        },
        {
            title: "5. Managing Cookies",
            content: "You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the Platform.\n\nYou can manage your cookie preferences through:\n• Your browser settings (Chrome, Firefox, Safari, Edge, etc.)\n• Our cookie consent banner when you first visit the Platform\n• Your account settings on the Platform"
        },
        {
            title: "6. Cookie Duration",
            content: "We use both session cookies and persistent cookies:\n• Session Cookies: Temporary cookies that expire when you close your browser\n• Persistent Cookies: Remain on your device for a set period or until you delete them"
        },
        {
            title: "7. Updates to This Cookie Policy",
            content: "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies."
        },
        {
            title: "8. Contact Us",
            content: "If you have any questions about our use of cookies, please contact us:\n\nEmail: support@dexon.global\nPhone: +1 (234) 567-890"
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <Header darkMode={darkMode} setDarkMode={setDarkMode} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />


            {/* Main Content */}
            <div className="container mx-auto px-4 py-12  mt-20">
                {/* Title Section */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last updated: 17/02/2026
                    </p>
                    <div className={`h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded mt-4`}></div>
                </div>

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className={`rounded-lg overflow-hidden transition ${darkMode
                                ? 'bg-gray-900 border border-gray-800'
                                : 'bg-white border border-gray-200'
                                }`}
                        >
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(index)}
                                className={`w-full px-6 py-4 flex items-center justify-between transition ${expandedSection === index
                                    ? darkMode
                                        ? 'bg-gray-800 border-b border-gray-700'
                                        : 'bg-gray-100 border-b border-gray-200'
                                    : ''
                                    }`}
                            >
                                <h2 className="text-xl font-bold text-left">{section.title}</h2>
                                <ChevronUp
                                    className={`w-5 h-5 transition-transform ${expandedSection === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Section Content */}
                            {expandedSection === index && (
                                <div className={`px-6 py-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                                    {section.subsections ? (
                                        <div className="space-y-4">
                                            {section.subsections.map((subsection, subIndex) => (
                                                <div key={subIndex}>
                                                    <h3 className="font-semibold mb-2 text-purple-500">
                                                        {subsection.subtitle}
                                                    </h3>
                                                    <p
                                                        className={`whitespace-pre-line leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {subsection.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p
                                            className={`whitespace-pre-line leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                        >
                                            {section.content}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div
                    className={`max-w-4xl mx-auto mt-12 p-6 rounded-lg ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-300'
                        }`}
                >
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        This Cookie Policy was last updated on <strong>February 17, 2026</strong>. We reserve the right to modify this policy at any time. If we make material changes, we will notify users via email or through our platform.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default CookiePolicy;
