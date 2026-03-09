import React, { useState } from 'react';
import { ChevronUp, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const navigate = useNavigate();

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using DexonGlobal (\"the Platform\"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
            title: "2. Description of Service",
            content: "DexonGlobal provides an AI-powered automated trading platform that allows users to create, configure, and deploy trading bots for various financial markets including Currency, Cryptocurrencies, Commodities, and Stock Indices. Our platform includes backtesting capabilities, risk management tools, and automated trading execution."
        },
        {
            title: "3. User Accounts",
            content: "To use certain features of the Platform, you must register for an account. You agree to:\n• Provide accurate, current, and complete information during registration\n• Maintain and update your account information to keep it accurate\n• Maintain the security of your password and account\n• Accept responsibility for all activities under your account\n• Notify us immediately of any unauthorized use of your account"
        },
        {
            title: "4. Subscription Plans",
            content: "DexonGlobal offers various subscription plans with different features and pricing. By subscribing to a plan, you agree to:\n• Pay the subscription fees as specified for your chosen plan\n• Abide by the limitations and restrictions of your subscription tier\n• Understand that subscription fees are non-refundable except as required by law\n• Accept that plan features and pricing may change with notice"
        },
        {
            title: "5. Trading Risks",
            content: "IMPORTANT RISK WARNING: Trading in financial instruments involves substantial risk of loss. You may lose some or all of your invested capital. Past performance is not indicative of future results. The Platform does not guarantee profits or protection against losses.\n\nYou acknowledge that:\n• All trading decisions are made at your own risk\n• You should only trade with funds you can afford to lose\n• Automated trading systems may not perform as expected\n• Market conditions can change rapidly and unpredictably\n• You are solely responsible for your trading decisions and outcomes"
        },
        {
            title: "6. Prohibited Activities",
            content: "You agree not to:\n• Use the Platform for any illegal purpose or in violation of any laws\n• Attempt to gain unauthorized access to the Platform or other users' accounts\n• Interfere with or disrupt the Platform's operation\n• Reverse engineer, decompile, or disassemble any part of the Platform\n• Use automated systems to access the Platform without permission\n• Share your account credentials with others\n• Use the Platform to manipulate markets or engage in fraudulent activities"
        },
        {
            title: "7. Intellectual Property",
            content: "All content, features, and functionality of the Platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of DexonGlobal and are protected by international copyright, trademark, and other intellectual property laws."
        },
        {
            title: "8. Limitation of Liability",
            content: "To the maximum extent permitted by law, DexonGlobal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Platform."
        },
        {
            title: "9. Indemnification",
            content: "You agree to indemnify and hold harmless DexonGlobal, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Platform or violation of these Terms."
        },
        {
            title: "10. Termination",
            content: "We reserve the right to terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason."
        },
        {
            title: "11. Changes to Terms",
            content: "We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the \"Last updated\" date. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms."
        },
        {
            title: "12. Governing Law",
            content: "These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the competent courts."
        },
        {
            title: "13. Contact Information",
            content: "If you have any questions about these Terms, please contact us at:\n\nEmail: support@dexon.global\nPhone: +1 (234) 567-890"
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <Header darkMode={darkMode} setDarkMode={setDarkMode} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />


            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 mt-20">
                {/* Title Section */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
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
                                    <p
                                        className={`whitespace-pre-line leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                    >
                                        {section.content}
                                    </p>
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
                        These Terms and Conditions were last updated on <strong>February 17, 2026</strong>. We reserve the right to modify these terms at any time. If we make material changes, we will notify users via email or through our platform.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default TermsAndConditions;
