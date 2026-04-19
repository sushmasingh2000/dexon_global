import { ExpandLess, ExpandMore, Logout } from "@mui/icons-material";
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import classNames from "classnames";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../../assets/favicon.png";
import { all_Data } from "../../mockdata/MockData";

const Sidebar = () => {
  const navigate = useNavigate();

  const [openSlide, setOpenSlide] = useState(true);
  const [openCollapse, setOpenCollapse] = useState({});

  const handleCollapse = (navLink) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [navLink]: !prevState[navLink],
    }));
  };

  // Drop-in replacement for your sidebar return block
  // Keeps all existing logic (navigate, openCollapse, handleCollapse, openSlide)
  // Matches the dark cyan/teal cyber aesthetic of the withdrawal page

  return (
    <div
      className={`
      ${openSlide ? "min-w-[16vw] max-w-[16vw]" : "w-[72px]"}
      h-screen flex flex-col relative overflow-hidden
      transition-all duration-300 ease-in-out
    `}
      style={{
        background: 'linear-gradient(180deg, #060d14 0%, #0a1219 40%, #0d1821 100%)',
        borderRight: '1px solid rgba(34,211,238,0.15)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.5), inset -1px 0 0 rgba(34,211,238,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      {/* Left edge glow line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/60 via-cyan-400/20 to-transparent" />

      {/* Background mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(34,211,238,0.8) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(59,130,246,0.6) 0%, transparent 50%)`,
        }}
      />

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyan-400/10 rounded-tr-none pointer-events-none" />

      {/* ─── LOGO ─── */}
      <div className={`
      flex items-center justify-center py-6 px-3 flex-shrink-0
      ${openSlide ? "px-5" : "px-2"}
    `}>
        <div className="relative">
          {/* Logo glow backdrop */}
          <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-xl" />
          <img
            alt="Logo"
            className={`
            relative z-10 rounded-xl shadow-lg transition-all duration-300
            ${openSlide ? "w-28" : "w-9"}
          `}
            src={loginLogo}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        {openSlide && <div className="w-1 h-1 rounded-full bg-cyan-400/60" />}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      {/* ─── NAV ITEMS ─── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-900/50">
        {all_Data?.map((nav, index) => {
          const isActive = window.location.pathname === nav.navLink;
          const hasChildren = nav.subcomponent?.length > 0;
          const isOpen = openCollapse[nav.navLink];

          return (
            <React.Fragment key={nav.id}>
              {/* Nav Item */}
              <button
                onClick={() => {
                  navigate(nav.navLink);
                  if (hasChildren) handleCollapse(nav.navLink);
                }}
                onContextMenu={(e) => {
                  if (!hasChildren) {
                    e.preventDefault();
                    window.open(nav.navLink, "_blank");
                  }
                }}
                title={!openSlide ? nav.navItem : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-xl mb-1 transition-all duration-200
                  ${openSlide ? "px-3 py-3" : "px-0 py-3 justify-center"}
                  group relative overflow-hidden
                  ${
                    isActive
                      ? "text-white"
                      : "text-cyan-300/70 hover:text-cyan-100"
                  }
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
                {/* Hover bg */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-200" />
                )}

                {/* Active left indicator */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-full" />
                )}

                {/* Icon */}
                <span className={`
                relative z-10 flex-shrink-0 transition-all duration-200
                ${isActive ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" : "text-cyan-500 group-hover:text-cyan-400"}
                ${openSlide ? "" : "mx-auto"}
              `}>
                  {nav.navIcon}
                </span>

                {/* Label */}
                {openSlide && (
                  <span className="relative z-10 flex-1 text-left text-sm font-medium tracking-wide truncate">
                    {nav.navItem}
                  </span>
                )}

                {/* Chevron */}
                {openSlide && hasChildren && (
                  <span className={`relative z-10 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Sub-items */}
              <Collapse in={openCollapse[nav.navLink]} timeout="auto" unmountOnExit>
                <div className={`mb-1 ${openSlide ? "ml-3 pl-3 border-l border-cyan-400/15" : "ml-0"}`}>
                  {nav.subcomponent?.map((subNav) => {
                    const isSubActive = window.location.pathname === subNav.navLink;
                    return (
                      <button
                        key={subNav.id}
                        onClick={() => navigate(subNav.navLink)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            window.open(subNav.navLink, "_blank");
                        }}
                        title={!openSlide ? subNav.navItem : undefined}
                        className={`
                        w-full flex items-center gap-3 rounded-lg mb-0.5 transition-all duration-200
                        ${openSlide ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                        group relative overflow-hidden
                        ${isSubActive ? "text-white" : "text-cyan-400/60 hover:text-cyan-200"}
                      `}
                        style={isSubActive ? {
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(14,116,144,0.1) 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.2)',
                        } : {}}
                      >
                        {!isSubActive && (
                          <div className="absolute inset-0 rounded-lg bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-200" />
                        )}
                        <span className={`
                        relative z-10 flex-shrink-0 text-sm
                        ${isSubActive ? "text-cyan-400" : "text-cyan-600 group-hover:text-cyan-400"}
                        ${openSlide ? "" : "mx-auto"}
                      `}>
                          {subNav.navIcon}
                        </span>
                        {openSlide && (
                          <span className="relative z-10 flex-1 text-left text-xs font-medium tracking-wide truncate">
                            {subNav.navItem}
                          </span>
                        )}
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
          title={!openSlide ? "Logout" : undefined}
          className={`
          w-full flex items-center gap-3 rounded-xl transition-all duration-200
          ${openSlide ? "px-3 py-3" : "px-0 py-3 justify-center"}
          group relative overflow-hidden text-red-400/80 hover:text-red-300
        `}
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(159,18,57,0.05) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(220,38,38,0.15)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(159,18,57,0.12) 100%)';
            e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(220,38,38,0.3), 0 4px 16px rgba(220,38,38,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(159,18,57,0.05) 100%)';
            e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(220,38,38,0.15)';
          }}
        >
          {/* Shine sweep on hover */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>

          <span className={`
          relative z-10 flex-shrink-0
          ${openSlide ? "" : "mx-auto"}
        `}>
            <Logout fontSize="small" />
          </span>

          {openSlide && (
            <span className="relative z-10 flex-1 text-left text-sm font-medium tracking-wide">
              Logout
            </span>
          )}
        </button>

        {/* Bottom ping dots */}
        {openSlide && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1 h-1 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400/30 animate-ping" style={{ animationDelay: '0.6s', animationDuration: '2s' }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDelay: '1.2s', animationDuration: '2s' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
