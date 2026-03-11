import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BarChartIcon from '@mui/icons-material/BarChart';
import FaceIcon from '@mui/icons-material/Face';
import HomeIcon from '@mui/icons-material/Home';
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  // Navigation items
  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { label: "Deposit", icon: <AccountBalanceWalletIcon />, path: "/topup_data" },
    { label: "Topup", icon: <BarChartIcon />, path: "/fund-transfer-to-topup-wallet" },
    { label: "Withdrawal", icon: <AccountTreeIcon />, path: "/with" },
    { label: "Profile", icon: <FaceIcon />, path: "/profile" },
  ];

  // Set active tab based on current path
  React.useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleNavigation = (newValue, path) => {
    setValue(newValue);
    navigate(path);
  };

  return (
    <div className="lg:flex h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar - visible only on md and above */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Page Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-12 md:mt-0 mb-20 lg:mb-0">
          <div className="py-4">
            {children}
          </div>
        </div>

        {/* Footer - Hidden on mobile (bottom nav replaces it) */}
        <div className="hidden lg:block text-center bg-gradient-to-r from-[#0a1219] via-[#0d1519] to-[#0a1219] text-gray-400 text-xs py-3 border-t border-cyan-400/20">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <span>Copyright © 2026 DexonGlobal. All rights reserved.</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Only visible on mobile (lg and below) */}
      <Box
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        sx={{
          borderTop: '1px solid rgba(34, 211, 238, 0.2)',
          boxShadow: '0 -4px 20px rgba(34, 211, 238, 0.1)',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            handleNavigation(newValue, navItems[newValue].path);
          }}
          sx={{
            background: 'linear-gradient(to right, #0a1219, #0d1519, #0a1219)',
            height: '70px',
            '& .MuiBottomNavigationAction-root': {
              color: '#9ca3af',
              minWidth: 'auto',
              padding: '6px 12px',
              transition: 'all 0.3s ease',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0%',
                height: '3px',
                background: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
                transition: 'width 0.3s ease',
                borderRadius: '0 0 4px 4px',
              },
              '&.Mui-selected': {
                color: '#22d3ee',
                '&::before': {
                  width: '70%',
                },
              },
              '&:hover': {
                background: 'rgba(34, 211, 238, 0.05)',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              marginTop: '4px',
              fontWeight: 500,
              '&.Mui-selected': {
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
              transition: 'all 0.3s ease',
            },
            '& .Mui-selected .MuiSvgIcon-root': {
              fontSize: '1.7rem',
              filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))',
            },
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={
                <div className="relative">
                  {item.icon}
                  {/* Active indicator dot */}
                  {value === index && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              }
            />
          ))}
        </BottomNavigation>
      </Box>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(13, 21, 25, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #22d3ee, #06b6d4);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #06b6d4, #0891b2);
        }
      `}</style>
    </div>
  );
};

export default MainLayout;