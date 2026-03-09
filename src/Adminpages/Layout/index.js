import { Notifications } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Sidebar from "../Shared/Sidebar";
import MobileNavigation from "../Shared/Sidebar/MobileNavigation";

const AdminLayout = ({ component, navItem, navLink, id }) => {
  const isMediumScreen = useMediaQuery({ maxWidth: 1000 });
  const usertype = localStorage.getItem("user_type");
  const user = localStorage.getItem("erp_username");

  return (
    <div
      className="lg:flex h-screen w-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #060d14 0%, #0a1219 50%, #0d1821 100%)',
      }}
    >
      {/* ─── SIDEBAR / MOBILE NAV ─── */}
      {!isMediumScreen ? <Sidebar /> : <MobileNavigation />}

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden relative">

        {/* Background mesh: cyan top-right + gold bottom-left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 85% 8%, rgba(34,211,238,0.05) 0%, transparent 40%),
                              radial-gradient(circle at 8% 92%, rgba(254,214,3,0.04) 0%, transparent 40%)`,
          }}
        />

        {/* ─── TOP HEADER BAR ─── */}
        {!isMediumScreen && (
          <header
            className="relative z-10 flex-shrink-0 flex items-center justify-between px-6 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(6,13,20,0.97) 0%, rgba(10,18,25,0.96) 60%, rgba(12,16,20,0.97) 100%)',
              borderBottom: '1px solid rgba(34,211,238,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(254,214,3,0.04)',
            }}
          >
            {/* Top shimmer: cyan → gold */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #22d3ee 30%, #fed603 70%, transparent 100%)', opacity: 0.5 }}
            />

            {/* Page Title */}
            <div className="flex items-center gap-3">
              {/* Accent mark: cyan → gold */}
              <div
                className="w-1 h-6 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #22d3ee 0%, #fed603 100%)',
                  boxShadow: '0 0 8px rgba(34,211,238,0.5)',
                }}
              />
              <h1
                className="text-lg font-semibold tracking-wide"
                style={{
                  background: 'linear-gradient(90deg, #cffafe, #22d3ee, #fed603)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {navItem}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Notification bell */}
              <button
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(254,214,3,0.05)',
                  border: '1px solid rgba(254,214,3,0.12)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(254,214,3,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(254,214,3,0.28)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(254,214,3,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(254,214,3,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(254,214,3,0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Notifications style={{ fontSize: 18, color: '#fed603' }} />
                {/* Gold notification dot */}
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: '#fed603' }}
                />
              </button>

              {/* Divider */}
              <div
                className="w-px h-8 mx-1"
                style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.15), rgba(254,214,3,0.15))' }}
              />

              {/* User card */}
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(254,214,3,0.03) 100%)',
                  border: '1px solid rgba(34,211,238,0.1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(254,214,3,0.06) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(254,214,3,0.2)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(254,214,3,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(254,214,3,0.03) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Avatar with dual glow */}
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(254,214,3,0.2))' }}
                  />
                  <Avatar
                    alt={user?.user_name}
                    src={"https://mui.com/static/images/avatar/3.jpg"}
                    sx={{
                      width: 32, height: 32,
                      position: 'relative', zIndex: 10,
                      outline: '2px solid rgba(254,214,3,0.25)',
                      outlineOffset: '1px',
                    }}
                  />
                  {/* Online dot */}
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full z-20"
                    style={{ background: '#22d3ee', border: '1.5px solid #060d14' }}
                  />
                </div>

                {/* User info */}
                <div className="flex flex-col leading-none">
                  <span
                    className="text-xs font-semibold capitalize"
                    style={{ color: 'rgba(224,242,254,0.9)' }}
                  >
                    {user?.user_name || 'User'}
                  </span>
                  <span
                    className="text-[10px] capitalize mt-0.5"
                    style={{ color: 'rgba(254,214,3,0.6)' }}
                  >
                    {usertype}
                  </span>
                </div>

                {/* Chevron */}
                <svg className="w-3 h-3 ml-1 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: 'rgba(254,214,3,0.4)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </header>
        )}

        {/* ─── SCROLLABLE PAGE CONTENT ─── */}
        <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-5">
          <div
            className="w-full min-h-full rounded-2xl p-1"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.03) 0%, rgba(254,214,3,0.02) 50%, rgba(34,211,238,0.02) 100%)',
              border: '1px solid rgba(34,211,238,0.07)',
              boxShadow: 'inset 0 1px 0 rgba(254,214,3,0.04)',
            }}
          >
            <div className="w-full min-h-full rounded-xl p-4">
              {component}
            </div>
          </div>
        </main>

        {/* ─── FOOTER STATUS BAR ─── */}
        {!isMediumScreen && (
          <footer
            className="relative z-10 flex-shrink-0 flex items-center justify-between px-6 py-2"
            style={{
              background: 'rgba(6,13,20,0.85)',
              borderTop: '1px solid rgba(34,211,238,0.07)',
            }}
          >
            {/* Bottom shimmer: gold → cyan */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #fed603 30%, #22d3ee 70%, transparent 100%)', opacity: 0.2 }}
            />

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-gray-600 tracking-widest uppercase">System Online</span>
              </div>
              <div className="w-px h-3 bg-gray-800" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee', opacity: 0.6 }} />
                <span className="text-[10px] text-gray-600 tracking-widest uppercase">SSL Secured</span>
              </div>
              <div className="w-px h-3 bg-gray-800" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#fed603', opacity: 0.6, animationDelay: '0.5s' }} />
                <span className="text-[10px] text-gray-600 tracking-widest uppercase">Live Data</span>
              </div>
            </div>

            <span className="text-[10px] tracking-wide"
              style={{ color: 'rgba(100,116,139,0.5)' }}>
              © 2025{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #22d3ee, #fed603)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                BEST TRADING WEBSITE
              </span>
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;