import { Collapse } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { all_Data } from "../../mockdata/MockData";
import loginLogo from "../../../assets/favicon.png";

export default function MobileNavigation() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});

  const handleCollapse = (navLink) => {
    setOpenCollapse((prev) => ({ ...prev, [navLink]: !prev[navLink] }));
  };

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ─── TOP APP BAR ─── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "linear-gradient(90deg, #060d14 0%, #0a1219 100%)",
          borderBottom: "1px solid rgba(34,211,238,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl text-cyan-300 hover:text-cyan-100 transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(14,116,144,0.1) 100%)",
            boxShadow: "inset 0 0 0 1px rgba(34,211,238,0.25)",
          }}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/10 blur-lg rounded-lg" />
            <img src={loginLogo} alt="Logo" className="relative z-10  h-7 rounded-lg" />
          </div>
          {/* <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "rgba(34,211,238,0.9)" }}
          >
            Admin
          </span> */}
        </div>

        {/* Right spacer (keeps title centered) */}
        <div className="w-9" />
      </div>

      {/* ─── BACKDROP ─── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm "
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── DRAWER ─── */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-72 
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "linear-gradient(180deg, #060d14 0%, #0a1219 40%, #0d1821 100%)",
          borderRight: "1px solid rgba(34,211,238,0.15)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.6), inset -1px 0 0 rgba(34,211,238,0.08)",
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        {/* Left edge glow */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/60 via-cyan-400/20 to-transparent" />
        {/* Mesh bg */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34,211,238,0.8) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(59,130,246,0.6) 0%, transparent 50%)`,
          }}
        />

        {/* ─── DRAWER HEADER ─── */}
        <div className="flex items-center justify-between px-5 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-xl" />
              <img src={loginLogo} alt="Logo" className="relative z-10 w-10 h-10 rounded-xl shadow-lg" />
            </div> */}
            <span
              className="text-base font-semibold tracking-widest uppercase"
              style={{ color: "rgba(34,211,238,0.9)" }}
            >
              Admin
            </span>
          </div>
          {/* Close button */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all duration-200"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-3 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>

        {/* ─── NAV LIST ─── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-900/50">
          {all_Data?.map((nav) => {
            const isActive = window.location.pathname === nav.navLink;
            const hasChildren = nav.subcomponent?.length > 0;
            const isOpen = openCollapse[nav.navLink];

            return (
              <React.Fragment key={nav.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      handleCollapse(nav.navLink);
                    } else {
                      handleNav(nav.navLink);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive ? "text-white" : "text-cyan-300/70 hover:text-cyan-100"}
                  `}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(14,116,144,0.15) 100%)",
                          boxShadow:
                            "inset 0 0 0 1px rgba(34,211,238,0.3), 0 4px 16px rgba(6,182,212,0.15)",
                        }
                      : {}
                  }
                >
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-200" />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-full" />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                      relative z-10 flex-shrink-0 transition-all duration-200
                      ${isActive
                        ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                        : "text-cyan-500 group-hover:text-cyan-400"
                      }
                    `}
                  >
                    {nav.navIcon}
                  </span>

                  {/* Label */}
                  <span className="relative z-10 flex-1 text-left text-sm font-medium tracking-wide truncate">
                    {nav.navItem}
                  </span>

                  {/* Chevron */}
                  {hasChildren && (
                    <span
                      className={`relative z-10 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Sub-items */}
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <div className="ml-3 pl-3 border-l border-cyan-400/15 mb-1">
                    {nav.subcomponent?.map((subNav) => {
                      const isSubActive = window.location.pathname === subNav.navLink;
                      return (
                        <button
                          key={subNav.id}
                          onClick={() => handleNav(subNav.navLink)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5
                            transition-all duration-200 group relative overflow-hidden
                            ${isSubActive ? "text-white" : "text-cyan-400/60 hover:text-cyan-200"}
                          `}
                          style={
                            isSubActive
                              ? {
                                  background:
                                    "linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(14,116,144,0.1) 100%)",
                                  boxShadow: "inset 0 0 0 1px rgba(34,211,238,0.2)",
                                }
                              : {}
                          }
                        >
                          {!isSubActive && (
                            <div className="absolute inset-0 rounded-lg bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-200" />
                          )}
                          <span
                            className={`
                              relative z-10 flex-shrink-0 text-sm
                              ${isSubActive ? "text-cyan-400" : "text-cyan-600 group-hover:text-cyan-400"}
                            `}
                          >
                            {subNav.navIcon}
                          </span>
                          <span className="relative z-10 flex-1 text-left text-xs font-medium tracking-wide truncate">
                            {subNav.navItem}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Collapse>
              </React.Fragment>
            );
          })}
        </div>

        {/* ─── LOGOUT ─── */}
        <div className="flex-shrink-0 px-2 py-4 border-t border-cyan-400/10">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              navigate("/");
            }}
            className="
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 group relative overflow-hidden
              text-red-400/80 hover:text-red-300
            "
            style={{
              background: "linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(159,18,57,0.05) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(220,38,38,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(159,18,57,0.12) 100%)";
              e.currentTarget.style.boxShadow =
                "inset 0 0 0 1px rgba(220,38,38,0.3), 0 4px 16px rgba(220,38,38,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(159,18,57,0.05) 100%)";
              e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(220,38,38,0.15)";
            }}
          >
            {/* Shine sweep */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <span className="relative z-10 flex-shrink-0">
              <Logout fontSize="small" />
            </span>
            <span className="relative z-10 flex-1 text-left text-sm font-medium tracking-wide">
              Logout
            </span>
          </button>

          {/* Ping dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1 h-1 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDelay: "0s", animationDuration: "2s" }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400/30 animate-ping" style={{ animationDelay: "0.6s", animationDuration: "2s" }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDelay: "1.2s", animationDuration: "2s" }} />
          </div>
        </div>
      </div>
    </>
  );
}