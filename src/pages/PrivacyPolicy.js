import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const navigate = useNavigate();

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const sections = [
        {
            title: "1. Introduction",
            content: "DexonGlobal (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our automated trading platform and related services."
        },
        {
            title: "2. Information We Collect",
            subsections: [
                {
                    subtitle: "2.1 Personal Information",
                    content: "We collect information that you provide directly to us, including:\n• Name, email address, and phone number\n• Account credentials and authentication information\n• Payment and billing information\n• Country and location information\n• Communication preferences"
                },
                {
                    subtitle: "2.2 Trading Account Information",
                    content: "When you connect a trading account, we collect:\n• Trading account numbers and credentials (encrypted)\n• Broker/server information\n• Trading capital and account balance information\n• Trading history and performance data"
                },
                {
                    subtitle: "2.3 Usage Information",
                    content: "We automatically collect information about your use of the Platform:\n• Device information and IP address\n• Browser type and version\n• Pages visited and features used\n• Time and date of access\n• Cookies and similar tracking technologies"
                }
            ]
        },
        {
            title: "3. How We Use Your Information",
            content: "We use the collected information for the following purposes:\n• To provide, maintain, and improve our services\n• To process transactions and manage subscriptions\n• To authenticate users and prevent fraud\n• To communicate with you about your account and our services\n• To provide customer support and respond to inquiries\n• To analyze usage patterns and improve user experience\n• To comply with legal obligations and enforce our terms\n• To send marketing communications (with your consent)"
        },
        {
            title: "4. Information Sharing and Disclosure",
            content: "We do not sell your personal information. We may share your information in the following circumstances:\n• Service Providers: With third-party service providers who assist in operating our platform\n• Legal Requirements: When required by law or to protect our rights\n• Business Transfers: In connection with a merger, acquisition, or sale of assets\n• With Your Consent: When you explicitly authorize us to share information"
        },
        {
            title: "5. Data Security",
            content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:\n• Encryption of sensitive data in transit and at rest\n• Secure authentication and access controls\n• Regular security assessments and updates\n• Employee training on data protection\n• Secure payment processing\n\nHowever, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security."
        },
        {
            title: "6. Data Retention",
            content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or regulatory purposes."
        },
        {
            title: "7. Your Rights",
            content: "Depending on your location, you may have the following rights regarding your personal information:\n• Access: Request access to your personal information\n• Correction: Request correction of inaccurate information\n• Deletion: Request deletion of your personal information\n• Portability: Request transfer of your data to another service\n• Objection: Object to processing of your personal information\n• Restriction: Request restriction of processing\n• Withdraw Consent: Withdraw consent for data processing\n\nTo exercise these rights, please contact us at support@dexon.global."
        },
        {
            title: "8. Cookies and Tracking Technologies",
            content: "We use cookies and similar tracking technologies to track activity on our Platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.\n\nFor more information about our use of cookies, please see our Cookie Policy."
        },
        {
            title: "9. Children's Privacy",
            content: "Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately."
        },
        {
            title: "10. International Data Transfers",
            content: "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives adequate protection."
        },
        {
            title: "11. Changes to This Privacy Policy",
            content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date. You are advised to review this Privacy Policy periodically for any changes."
        },
        {
            title: "12. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us:\n\nEmail: support@dexon.global\nPhone: +1 (234) 567-890"
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header Component */}
            <Header darkMode={darkMode} setDarkMode={setDarkMode} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12  mt-20">
                {/* Title Section */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
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
                        This Privacy Policy was last updated on <strong>February 17, 2026</strong>. We reserve the right to modify this policy at any time. If we make material changes, we will notify users via email or through our platform.
                    </p>
                </div>
            </div>

            {/* Footer Component */}
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default PrivacyPolicy;
