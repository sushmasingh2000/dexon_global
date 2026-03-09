import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import bit from "../../assets/logo.png";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { areYouSureFn, formatedDate, getFloatingValue } from "../../utils/utilityFun";

const ModalButtons = ({ onClose, loading, color = "cyan" }) => {
  const isCyan = color === "cyan";
  return (
    <div className="flex justify-end gap-3 mt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
        style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.18)',
          color: 'rgba(252,165,165,0.75)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.13)';
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
          e.currentTarget.style.color = 'rgba(252,165,165,1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)';
          e.currentTarget.style.color = 'rgba(252,165,165,0.75)';
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="relative px-6 py-2 rounded-lg text-xs font-bold overflow-hidden group/btn transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isCyan
            ? 'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(14,116,144,0.18) 100%)'
            : 'linear-gradient(135deg, rgba(234,179,8,0.25) 0%, rgba(180,120,0,0.18) 100%)',
          border: isCyan ? '1px solid rgba(34,211,238,0.35)' : '1px solid rgba(234,179,8,0.35)',
          color: isCyan ? 'rgba(34,211,238,0.95)' : 'rgba(253,224,71,0.95)',
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
        </div>
        <span className="relative z-10">
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : "Save"}
        </span>
      </button>
    </div>
  );
};

const InfoRow = ({ label, value, color = "cyan" }) => (
  <div
    className="flex justify-between items-center px-3 py-2.5 rounded-lg hover:bg-white/[0.02] transition-colors duration-200"
    style={{ borderBottom: '1px solid rgba(34,211,238,0.07)' }}
  >
    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
    <span
      className="font-semibold text-sm text-right max-w-[55%] truncate"
      style={{
        background: color === 'yellow'
          ? 'linear-gradient(90deg, #fde68a, #fb923c)'
          : color === 'green'
            ? 'linear-gradient(90deg, #86efac, #34d399)'
            : 'linear-gradient(90deg, #a5f3fc, #60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </span>
  </div>
);

const Card = ({ children, accent = "cyan", className = "" }) => {
  const colors = {
    cyan: { border: 'rgba(34,211,238,0.15)', bar: 'from-cyan-400 via-blue-500', glow: 'rgba(34,211,238,0.03)', corner: 'rgba(34,211,238,0.12)' },
    yellow: { border: 'rgba(234,179,8,0.15)', bar: 'from-yellow-400 via-amber-500', glow: 'rgba(234,179,8,0.03)', corner: 'rgba(234,179,8,0.12)' },
    green: { border: 'rgba(52,211,153,0.15)', bar: 'from-emerald-400 via-green-500', glow: 'rgba(52,211,153,0.03)', corner: 'rgba(52,211,153,0.12)' },
  };
  const c = colors[accent];
  return (
    <div
      className={`rounded-2xl relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(10,18,25,0.97) 0%, rgba(13,24,33,0.95) 100%)',
        border: `1px solid ${c.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${c.bar} to-transparent rounded-l-2xl`} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" style={{ borderTop: `1px solid ${c.corner}`, borderRight: `1px solid ${c.corner}`, borderTopRightRadius: '1rem' }} />
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: c.glow }} />
      {children}
    </div>
  );
};

const CardHeader = ({ title, accent = "cyan" }) => {
  const dotColor = { cyan: '#22d3ee', yellow: '#facc15', green: '#34d399' }[accent];
  const gradientText = {
    cyan: 'linear-gradient(90deg, #cffafe, #67e8f9, #60a5fa)',
    yellow: 'linear-gradient(90deg, #fde68a, #fbbf24, #f59e0b)',
    green: 'linear-gradient(90deg, #bbf7d0, #6ee7b7, #34d399)',
  }[accent];
  return (
    <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dotColor }} />
      <h3 className="text-[11px] font-bold tracking-widest uppercase"
        style={{ background: gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {title}
      </h3>
      <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${dotColor}20, transparent)` }} />
    </div>
  );
};

const Profile = () => {
  const [loding, setLoding] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [sponName, setSponName] = useState(null);

  const { data: profile, refetch: refetchProfile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || {}; // Changed to empty object for safer access



  const fkProfile = useFormik({
    initialValues: {
      name: user_profile?.lgn_name || "",
      newPass: "",
      oldPass: "",
      mobile: user_profile?.lgn_mobile || "",
      wallet: user_profile?.wallet_Address || "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = fkProfile.values;
      UpdateProfileFn(reqbody);
    },
  });

  async function UpdateProfileFn(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.update_profile,
        reqbody
      );
      // toast.success(res?.data?.message);
      Swal.fire({
        title:
          String(res?.data?.success) === "true"
            ? "🎉 Congratulations!"
            : "Error!",
        text: res?.data?.message,
        icon: String(res?.data?.success) === "true" ? "success" : "error",
        confirmButtonColor: "black",
      });
      if (res?.data?.success) {
        setShowProfileModal(false);
        refetchProfile();
        fkProfile.handleReset();

      }
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to update profile.");
    }
    setLoding(false);
  }

  return (
    <>
      <div className="relative">
        {/* Page background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(34,211,238,0.03)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(59,130,246,0.03)' }} />

        <div className="relative z-10 max-w-6xl mx-auto space-y-5">

          {/* ═══════════════════════════════════════════
            ROW 1 — HERO PROFILE BANNER
        ═══════════════════════════════════════════ */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, rgba(6,13,20,0.98) 0%, rgba(10,18,28,0.96) 50%, rgba(8,14,22,0.98) 100%)',
              border: '1px solid rgba(34,211,238,0.12)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
            }}
          >
            {/* Hero gradient stripe */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400/60 via-blue-500/40 to-transparent" />
            <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-cyan-400/15 to-transparent" />

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ background: 'rgba(34,211,238,0.2)' }} />
                <div
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(59,130,246,0.06) 100%)',
                    border: '2px solid rgba(34,211,238,0.25)',
                    boxShadow: '0 0 32px rgba(34,211,238,0.15)',
                  }}
                >
                  <img src={bit} alt="Avatar" className="w-20" />
                </div>
                {/* Online badge */}
                <div
                  className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider"
                  style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#6ee7b7' }}
                >
                  <div className={`w-1 h-1 rounded-full ${getFloatingValue(user_profile?.tr03_topup_wallet) > 0 ? "bg-emerald-400" : "bg-red-400"} animate-pulse`} />
                  {getFloatingValue(user_profile?.tr03_topup_wallet) > 0 ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Name / ID info */}
              <div className="flex-1 text-center sm:text-left">
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
                  style={{ background: 'linear-gradient(90deg, #e0f2fe, #7dd3fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {user_profile?.lgn_name || "—"}
                </h1>
                <p className="text-gray-500 text-sm mb-3">{user_profile?.lgn_email || "—"}</p>

                {/* ID chips */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono"
                    style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', color: 'rgba(34,211,238,0.7)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                    </svg>
                    Self Id: {user_profile?.tr03_cust_id || "—"}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: 'rgba(147,197,253,0.7)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                    Sponsor Id: {user_profile?.spon_id || "—"}
                  </div>
                </div>
              </div>

              {/* Right: Date chips */}
              <div className="flex flex-col gap-2 text-right flex-shrink-0">
                <div className="text-right">
                  <p className="text-[9px] text-gray-600 tracking-widest uppercase mb-0.5">Registered</p>
                  <p className="text-xs font-semibold" style={{ color: 'rgba(34,211,238,0.7)' }}>
                    {formatedDate(moment, user_profile?.tr03_reg_date) || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-600 tracking-widest uppercase mb-0.5">Activated</p>
                  <p className="text-xs font-semibold" style={{ color: 'rgba(34,211,238,0.7)' }}>
                    {formatedDate(moment, user_profile?.tr03_topup_date) || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom ping particles */}
            <div className="absolute bottom-4 right-8 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
            <div className="absolute top-8 right-24 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping pointer-events-none" style={{ animationDuration: '3s', animationDelay: '1.2s' }} />
          </div>

          {/* ═══════════════════════════════════════════
            ROW 2 — WALLET STATS (4-col grid)
        ═══════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              <h2 className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(34,211,238,0.6)' }}>Wallet Overview</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Income', value: getFloatingValue(user_profile?.tr03_total_income) + ' USD', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', accent: 'cyan' },
                { label: 'Topup Wallet', value: getFloatingValue(user_profile?.tr03_topup_wallet) + ' USD', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', accent: 'cyan' },
                { label: 'Fund Wallet', value: getFloatingValue(user_profile?.tr03_fund_wallet) + ' USD', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', accent: 'green' },
                { label: 'Current Balance', value: getFloatingValue(user_profile?.tr03_inc_wallet) + ' USD', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'yellow' },
              ].map((item, i) => {
                const colors = {
                  cyan: { bg: 'rgba(34,211,238,0.05)', border: 'rgba(34,211,238,0.14)', icon: 'rgba(34,211,238,0.4)', grad: 'linear-gradient(90deg,#cffafe,#67e8f9,#60a5fa)' },
                  green: { bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.14)', icon: 'rgba(52,211,153,0.4)', grad: 'linear-gradient(90deg,#bbf7d0,#6ee7b7)' },
                  yellow: { bg: 'rgba(234,179,8,0.05)', border: 'rgba(234,179,8,0.14)', icon: 'rgba(234,179,8,0.4)', grad: 'linear-gradient(90deg,#fde68a,#fb923c)' },
                }[item.accent];
                return (
                  <div key={i} className="rounded-xl p-4 transition-all duration-200 hover:translate-y-[-2px] group"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.icon }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-gray-500">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold" style={{ background: colors.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {item.value}
                    </p>
                    {/* Mini progress bar */}
                    <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: `${colors.border}` }}>
                      <div className="h-full rounded-full w-2/3" style={{ background: colors.grad }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
            ROW 3 — ACCOUNT INFO + PROFILE SETTINGS
        ═══════════════════════════════════════════ */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">

            {/* Card 1 — Account Info */}
            <Card accent="cyan">
              <CardHeader title="Account Information" accent="cyan" />
              <div className="px-5 py-3 space-y-0.5">
                <InfoRow label="Name" value={user_profile?.lgn_name || "—"} color="yellow" />
                <InfoRow label="Email" value={user_profile?.lgn_email || "—"} color="yellow" />
                <InfoRow label="Mobile" value={user_profile?.lgn_mobile || "—"} color="green" />
                <InfoRow label="Customer ID" value={user_profile?.tr03_cust_id || "—"} />
                <InfoRow label="Sponsor ID" value={user_profile?.spon_id || "—"} />
                <InfoRow label="Registration Date" value={formatedDate(moment, user_profile?.tr03_reg_date)} />
                <InfoRow label="Activation Date" value={formatedDate(moment, user_profile?.tr03_topup_date)} />

                {/* Topup Team section */}
                {user_profile?.jnr_allow_for_team_topup && (
                  <>
                    <InfoRow label="Team Topup Balance" value={user_profile?.jnr_team_topup_bal} color="green" />
                    <div className="flex justify-between items-center px-3 py-3 rounded-lg"
                      style={{ borderBottom: '1px solid rgba(34,211,238,0.07)' }}>
                      <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">Topup Team</span>
                      <button
                        onClick={() => setShowTopupModal(true)}
                        className="relative px-4 py-1.5 rounded-lg text-xs font-bold overflow-hidden group/btn transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(14,116,144,0.15) 100%)',
                          border: '1px solid rgba(34,211,238,0.3)',
                          color: 'rgba(34,211,238,0.9)',
                        }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 overflow-hidden rounded-lg pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                        </div>
                        <span className="relative z-10">TOPUP</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="pb-4" />
            </Card>

            {/* Card 2 — Profile Settings */}
            <Card accent="yellow">
              <CardHeader title="Profile Settings" accent="yellow" />
              <div className="px-5 py-5 space-y-4">

                {/* Update profile row */}
                <div className="flex justify-between items-center px-3 py-3 rounded-xl"
                  style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.1)' }}>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Update Profile</p>
                    <p className="text-gray-600 text-xs mt-0.5">Name & mobile number</p>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="relative px-5 py-2 rounded-lg text-xs font-bold overflow-hidden group/btn transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(180,120,0,0.14) 100%)',
                      border: '1px solid rgba(234,179,8,0.35)',
                      color: 'rgba(253,224,71,0.9)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(234,179,8,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 overflow-hidden rounded-lg pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                    </div>
                    <span className="relative z-10 flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </span>
                  </button>
                </div>

                {/* Change password row */}
                <div className="flex justify-between items-center px-3 py-3 rounded-xl"
                  style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.1)' }}>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Change Password</p>
                    <p className="text-gray-600 text-xs mt-0.5">Update your login credentials</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="relative px-5 py-2 rounded-lg text-xs font-bold overflow-hidden group/btn transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(234,179,8,0.06)',
                      border: '1px solid rgba(234,179,8,0.2)',
                      color: 'rgba(253,224,71,0.6)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(234,179,8,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(234,179,8,0.35)';
                      e.currentTarget.style.color = 'rgba(253,224,71,0.9)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(234,179,8,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(234,179,8,0.2)';
                      e.currentTarget.style.color = 'rgba(253,224,71,0.6)';
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change
                    </span>
                  </button>
                </div>

                {/* Wallet address row */}
                {/* <div className="flex justify-between items-center px-3 py-3 rounded-xl"
                  style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.1)' }}>
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-gray-300 text-sm font-medium">Wallet Address</p>
                    <p className="text-xs font-mono truncate mt-0.5" style={{ color: 'rgba(253,224,71,0.5)' }}>
                      {user_profile?.lgn_mobile || "Not set"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="flex-shrink-0 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'rgba(234,179,8,0.06)',
                      border: '1px solid rgba(234,179,8,0.2)',
                      color: 'rgba(253,224,71,0.6)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(234,179,8,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(234,179,8,0.35)';
                      e.currentTarget.style.color = 'rgba(253,224,71,0.9)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(234,179,8,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(234,179,8,0.2)';
                      e.currentTarget.style.color = 'rgba(253,224,71,0.6)';
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {user_profile?.lgn_mobile ? "Update" : "Add"}
                    </span>
                  </button>
                </div> */}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Modal wrapper helper */}
      {[
        showWalletModal && {
          key: 'wallet', accent: 'cyan', title: fkProfile.values.wallet_address ? "Update Wallet Address" : "Add Wallet Address",
          onClose: () => { setShowWalletModal(false); fkProfile.handleReset(); },
          onSubmit: (e) => { e.preventDefault(); areYouSureFn(Swal, () => fkProfile.handleSubmit()); },
          fields: [{ label: 'Wallet Address', name: 'wallet_address', type: 'text', placeholder: 'Enter wallet address', value: fkProfile.values.wallet_address, onChange: fkProfile.handleChange, mono: true }],
        },
        showPasswordModal && {
          key: 'password', accent: 'cyan', title: 'Change Password',
          onClose: () => { setShowPasswordModal(false); setShowOldPass(false); setShowNewPass(false); fkProfile.handleReset(); },
          onSubmit: (e) => { e.preventDefault(); areYouSureFn(Swal, () => fkProfile.handleSubmit()); },
          fields: [
            { label: 'Old Password', name: 'oldPass', type: showOldPass ? 'text' : 'password', placeholder: 'Enter old password', value: fkProfile.values.oldPass, onChange: fkProfile.handleChange, isPasswordField: true, isVisible: showOldPass, toggleVisibility: () => setShowOldPass((prev) => !prev) },
            { label: 'New Password', name: 'newPass', type: showNewPass ? 'text' : 'password', placeholder: 'Enter new password', value: fkProfile.values.newPass, onChange: fkProfile.handleChange, isPasswordField: true, isVisible: showNewPass, toggleVisibility: () => setShowNewPass((prev) => !prev) },
          ],
        },
      ].filter(Boolean).map(modal => (
        <div key={modal.key} className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <Card accent={modal.accent} className="w-full max-w-sm mx-4">
            <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(34,211,238,0.08)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-white text-sm font-bold tracking-wide uppercase">{modal.title}</h3>
                </div>
                <button onClick={modal.onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={modal.onSubmit}>
              <div className="px-6 py-5 space-y-4">
                {modal.fields.map(f => (
                  <div key={f.name}>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest mb-2">{f.label}</label>
                    <div className="relative">
                      <input
                        type={f.type} name={f.name} placeholder={f.placeholder}
                        value={f.value} onChange={f.onChange}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 placeholder:text-gray-700 ${f.mono ? 'font-mono' : ''} ${f.isPasswordField ? 'pr-10' : ''}`}
                        style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.14)', color: 'rgba(224,242,254,0.9)' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(34,211,238,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.07)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(34,211,238,0.14)'; e.target.style.boxShadow = 'none'; }}
                      />
                      {f.isPasswordField && (
                        <button
                          type="button"
                          onClick={f.toggleVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300/70 hover:text-cyan-200 transition-colors"
                          aria-label={f.isVisible ? `Hide ${f.label}` : `Show ${f.label}`}
                        >
                          {f.isVisible ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.042-3.368m2.087-1.858A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.161 5.065M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 9L3 3" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <ModalButtons onClose={modal.onClose} loading={loding} color="cyan" />
              </div>
            </form>
          </Card>
        </div>
      ))}

      {/* Update Profile Modal (yellow) */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <Card accent="yellow" className="w-full max-w-sm mx-4">
            <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(234,179,8,0.08)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <h3 className="text-white text-sm font-bold tracking-wide uppercase">Update Profile</h3>
                </div>
                <button onClick={() => { setShowProfileModal(false); fkProfile.handleReset(); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); areYouSureFn(Swal, () => fkProfile.handleSubmit()); }}>
              <div className="px-6 py-5 space-y-4">
                {[
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Mobile', name: 'mobile', type: 'text' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-[9px] text-gray-500 uppercase tracking-widest mb-2">
                      {f.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={f.type} name={f.name} id={f.name}
                      value={fkProfile.values[f.name]} onChange={fkProfile.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 placeholder:text-gray-700"
                      style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.15)', color: 'rgba(254,249,195,0.9)' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(234,179,8,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(234,179,8,0.07)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(234,179,8,0.15)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <ModalButtons onClose={() => { setShowProfileModal(false); fkProfile.handleReset(); }} loading={loding} color="yellow" />
              </div>
            </form>
          </Card>
        </div>
      )}


    </>
  );
};

export default Profile;

