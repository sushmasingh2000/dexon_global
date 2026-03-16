import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import {
  FaBars,
  FaSignOutAlt,
  FaUserFriends,
  FaWallet,
  FaChartLine,
  FaHistory,
  FaExchangeAlt,
  FaFileAlt,
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
  FaUsers,
  FaSitemap,
  FaCoins,
  FaHandHoldingUsd,
  FaLayerGroup,
  FaTrophy,
  FaGlobe,
  FaChartBar,
  FaUserCircle,
  FaHome,
  FaAngleDown,
  FaAngleUp,
  FaChevronLeft,
} from "react-icons/fa";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  MdDashboard,
  MdSwapHoriz,
  MdAccountBalanceWallet,
  MdSupportAgent,
} from "react-icons/md";

import { apiConnectorGet } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import logo from "../../../assets/favicon.png";
import logo1 from "../../../assets/logo.png";

const menu = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    path: "/dashboard",
  },
  {
    title: "Fund Deposit",
    icon: <FaArrowDown />,
    submenu: [
      { title: "Fund Deposit", icon: <MdAccountBalanceWallet />, path: "/topup_data" },
      { title: "Deposit History", icon: <FaHistory />, path: "/activation" },
      { title: "Fund Transfer", icon: <FaExchangeAlt />, path: "/fund-transfer-to-topup-wallet" },
      { title: "Transfer History", icon: <MdSwapHoriz />, path: "/fund-transfer-history" },
      { title: "Topup History", icon: <FaChartBar />, path: "/topup_history" },
    ],
  },
  {
    title: "Fund Withdrawal",
    icon: <FaArrowUp />,
    submenu: [
      { title: "Fund Withdrawal", icon: <FaMoneyBillWave />, path: "/with" },
      { title: "Capital Withdrawal", icon: <FaWallet />, path: "/capital-with" },
      { title: "Withdrawal Report", icon: <FaFileAlt />, path: "/payout-report" },
    ],
  },
  {
    title: "Network",
    icon: <FaUsers />,
    submenu: [
      { title: "Direct Member", icon: <FaUserFriends />, path: "/referral" },
      { title: "Team Member", icon: <FaUsers />, path: "/downline" },
      { title: "Member Tree", icon: <FaSitemap />, path: "/team" },
    ],
  },
  {
    title: "Income",
    icon: <FaCoins />,
    submenu: [
      { title: "Trading Income", icon: <FaChartLine />, path: "/income/roi" },
      { title: "Sponsor Income", icon: <FaHandHoldingUsd />, path: "/income/direct" },
      { title: "Community Level Income", icon: <FaLayerGroup />, path: "/income/level" },
      { title: "Leadership Rank Bonus", icon: <FaTrophy />, path: "/income/salary" },
      { title: "Dexon Global Reward Pool", icon: <FaGlobe />, path: "/income/reward" },
    ],
  },
  {
    title: "Trade & Pairs",
    icon: <TrendingUpIcon />,
    submenu: [
      { title: "Our Orders", icon: <FaChartLine />, path: "https://trade.dexon.global" },
    ],
  },
  {
    title: "Ticket & Support",
    icon: <MdSupportAgent />,
    path: "/ticket_support",
  },
  {
    title: "Profile",
    icon: <FaUserCircle />,
    path: "/profile",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();

  const { data: profile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || {};

  return (
    <>
      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 
            bg-gradient-to-r from-[#0a1219] via-[#0d1519] to-[#0a1219] 
            border-b border-cyan-400/30 px-2 flex items-center justify-between 
            shadow-lg shadow-cyan-400/20 backdrop-blur-md"
      >
        <button
          onClick={() => setOpen(true)}
          className="relative text-cyan-400 text-xl p-2 rounded-lg 
                         hover:bg-cyan-400/10 transition-all duration-300 group"
        >
          <FaBars className="group-hover:scale-110 transition-transform duration-300" />
          <div
            className="absolute inset-0 bg-cyan-400/20 rounded-lg 
                opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"
          ></div>
        </button>

        <div className="flex justify-end">
          <img src={logo} alt="logo" className="w-[50%] h-12 object-contain" />
        </div>
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 top-0 left-0 z-50 h-screen w-80
              bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21]
              text-white shadow-2xl shadow-cyan-400/20
              transform transition-transform duration-300 ease-out
              border-r border-cyan-400/20
              ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
              overflow-hidden`}
      >
        {/* Decorative background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>

        {/* Accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logo1} alt="logo1" />
              </div>
            </div>
            <div>
              <img src={logo} className="!w-[50%]" alt="logo" />
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-cyan-400 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-cyan-400/10"
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* User Info Card */}
        <div className="relative z-10 mx-3 mt-4 mb-2 p-4 rounded-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-400/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <FaUserCircle className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                {user_profile?.lgn_name || user_profile?.lgn_email || "NA"}
              </p>
              <p className="text-cyan-400 text-xs">Premium Member</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-xl"></div>
        </div>

        {/* Menu Navigation */}
        <nav className="relative z-10 px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar">
          {menu.map((item, i) => {
            const isActive = active === item.title;
            const hasSubmenu = !!item.submenu;
            return (
              <div key={i}>
                <div
                  onClick={() => {
                    if (hasSubmenu) {
                      setOpenSubmenu(openSubmenu === i ? null : i);
                    } else {
                      setActive(item.title);
                      navigate(item.path);
                      setOpen(false);
                    }
                  }}
                  onContextMenu={(e) => {
                    if (!hasSubmenu) {
                      e.preventDefault();
                      window.open(item.path, "_blank");
                    }
                  }}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-900/40 to-blue-900/30 text-white shadow-lg shadow-cyan-400/20"
                        : "hover:bg-white/5 text-gray-300 hover:text-white"
                    }`}
                >
                  {/* Icon container */}
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`text-base ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>

                  {/* Menu text */}
                  <span
                    className={`font-medium text-sm transition-all duration-300 ${
                      isActive ? "translate-x-1" : ""
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* Submenu indicator */}
                  {hasSubmenu && (
                    <span className="ml-auto text-xs text-cyan-400">
                      {openSubmenu === i ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && openSubmenu === i && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((sub, j) => {
                      const isSubActive = active === sub.title;
                      return (
                        <div
                          key={j}
                          onClick={() => {
                            setActive(sub.title);
                            if (sub?.title === "Our Orders") {
                              window.open(sub?.path, "_blank");
                            } else {
                              navigate(sub.path);
                            }
                            setOpen(false);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            window.open(sub.path, "_blank");
                          }}
                          className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                            ${
                              isSubActive
                                ? "bg-gradient-to-r from-cyan-900/60 to-blue-900/40 text-white shadow"
                                : "hover:bg-white/5 text-gray-300 hover:text-white"
                            }`}
                        >
                          <span
                            className={`text-base ${
                              isSubActive
                                ? "text-cyan-400"
                                : "text-gray-400 group-hover:text-cyan-300"
                            }`}
                          >
                            {sub.icon}
                          </span>
                          <span className="text-xs font-medium">{sub.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="relative z-10 mt-auto p-4 border-t border-cyan-400/20 bg-gradient-to-r from-red-900/10 to-rose-900/10">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="group relative flex items-center gap-3 px-4 py-3 w-full rounded-xl
            text-red-400 hover:text-white transition-all duration-300 overflow-hidden
            border border-red-400/30 hover:border-red-400/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:from-red-600/20 group-hover:to-rose-600/20 transition-all duration-300"></div>

            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-red-900/20 group-hover:bg-red-600/30 transition-all duration-300">
              <FaSignOutAlt className="text-lg" />
            </div>

            <span className="relative font-semibold text-sm">Logout</span>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            </div>
          </button>
        </div>

        {/* Version info */}
        <div className="relative z-10 px-4 py-2 text-center">
          <p className="text-gray-500 text-xs">Version 1.0.0</p>
        </div>
      </aside>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(13, 21, 25, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #22d3ee, #06b6d4);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #06b6d4, #0891b2);
        }
      `}</style>
    </>
  );
};

export default Sidebar;