import { Block, CheckCircle, Edit } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint, frontend } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import moment from "moment";

// ── Reusable styled input ─────────────────────────────────────────────────────
const ModalInput = ({ label, name, type = "text", value, onChange, placeholder = "", required = false, mono = false, rightSlot }) => (
  <div>
    <label className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 placeholder:text-gray-700 ${mono ? "font-mono" : ""} ${rightSlot ? "pr-10" : ""}`}
        style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.14)", color: "rgba(224,242,254,0.9)" }}
        onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)"; }}
        onBlur={(e)  => { e.target.style.borderColor = "rgba(34,211,238,0.14)"; e.target.style.boxShadow = "none"; }}
      />
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  </div>
);

const EyeToggle = ({ visible, onToggle }) => (
  <button type="button" onClick={onToggle} className="text-cyan-300/70 hover:text-cyan-200 transition-colors">
    {visible ? (
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
);

// ── Edit Profile Modal ────────────────────────────────────────────────────────
const EditProfileModal = ({ row, onClose, onSaved }) => {
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fk = useFormik({
    initialValues: {
      name: row?.lgn_name || "", email: row?.lgn_email || "",
      mobile: row?.lgn_mobile || "", password: "", confirmPassword: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.password || values.confirmPassword) {
        if (values.password !== values.confirmPassword) { toast.error("Password and confirm password must match."); return; }
      }
      const result = await Swal.fire({
        title: '<span style="color:#22d3ee;font-size:1rem;">Confirm Update?</span>',
        html: `<p style="color:#94a3b8;font-size:0.85rem;">Update profile for <strong style="color:#22d3ee">${row?.lgn_name}</strong></p>`,
        icon: "question", background: "#101827", showCancelButton: true,
        confirmButtonColor: "#22d3ee", cancelButtonColor: "#374151",
        confirmButtonText: "Yes, Update", cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) return;
      setLoading(true);
      try {
        const res = await apiConnectorPostAdmin(endpoint?.update_profile, {
          editUserId: row?.lgn_jnr_id || row?.tr03_reg_id,
          name: values.name, email: values.email, mobile: values.mobile,
          newPass: values.password || undefined,
        });
        if (String(res?.data?.success) === "true") {
          toast.success(res?.data?.message || "Profile updated successfully!");
          onSaved(); onClose();
        } else { toast.error(res?.data?.message || "Update failed."); }
      } catch (e) { console.error(e); toast.error("Something went wrong."); }
      setLoading(false);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(10,18,25,0.97),rgba(13,24,33,0.95))", border: "1px solid rgba(34,211,238,0.15)", boxShadow: "0 8px 48px rgba(0,0,0,0.5)" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-l-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-white text-sm font-bold tracking-widest uppercase">Edit Profile</h3>
          </div>
          <div className="text-right">
            <p className="text-cyan-300 text-xs font-semibold">{row?.lgn_name}</p>
            <p className="text-gray-500 text-[10px] font-mono">{row?.lgn_cust_id}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors ml-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={fk.handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-[9px] text-cyan-400/50 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-cyan-400/10" />Basic Info<span className="flex-1 h-px bg-cyan-400/10" />
              </p>
              <div className="space-y-3">
                <ModalInput label="Name"   name="name"   value={fk.values.name}   onChange={fk.handleChange} required />
                <ModalInput label="Email"  name="email"  type="email" value={fk.values.email}  onChange={fk.handleChange} required />
                <ModalInput label="Mobile" name="mobile" value={fk.values.mobile} onChange={fk.handleChange} />
              </div>
            </div>
            <div>
              <p className="text-[9px] text-cyan-400/50 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-cyan-400/10" />Change Password <span className="text-gray-600 normal-case">(optional)</span><span className="flex-1 h-px bg-cyan-400/10" />
              </p>
              <div className="space-y-3">
                <ModalInput label="New Password" name="password" type={showPass ? "text" : "password"}
                  value={fk.values.password} onChange={fk.handleChange} placeholder="Leave blank to keep current"
                  rightSlot={<EyeToggle visible={showPass} onToggle={() => setShowPass(p => !p)} />} />
                <ModalInput label="Confirm Password" name="confirmPassword" type={showConfirm ? "text" : "password"}
                  value={fk.values.confirmPassword} onChange={fk.handleChange} placeholder="Repeat new password"
                  rightSlot={<EyeToggle visible={showConfirm} onToggle={() => setShowConfirm(p => !p)} />} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-6 pb-5" style={{ borderTop: "1px solid rgba(34,211,238,0.06)", paddingTop: "1rem" }}>
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "rgba(252,165,165,0.75)" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.13)"; e.currentTarget.style.color="rgba(252,165,165,1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.06)"; e.currentTarget.style.color="rgba(252,165,165,0.75)"; }}
            >Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold overflow-hidden relative transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.25),rgba(14,116,144,0.18))", border: "1px solid rgba(34,211,238,0.35)", color: "rgba(34,211,238,0.95)" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {loading ? (<><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>) : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubAdminToggle = ({ enabled, onChange, loading }) => (
  <button
    onClick={onChange}
    disabled={loading}
    title={enabled ? "Revoke SubAdmin Access" : "Grant SubAdmin Access"}
    className={`relative inline-flex items-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
      ${enabled
        ? "shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        : "shadow-none"
      }`}
    style={{
      background: enabled
        ? "linear-gradient(135deg,#7c3aed,#a855f7)"
        : "rgba(255,255,255,0.06)",
      border: enabled
        ? "1px solid rgba(168,85,247,0.6)"
        : "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-md
      ${enabled ? "left-[26px] bg-white" : "left-0.5 bg-gray-500"}`}
    />
  </button>
);

// ── Main MemberList ───────────────────────────────────────────────────────────
const MemberList = () => {
  const navigate  = useNavigate();
  const [loading,            setLoading]            = useState(false);
  const [subAdminLoadingId,  setSubAdminLoadingId]  = useState(null); // tracks which row is loading
  const [page,               setPage]               = useState(1);
  const [revealedPassIndex,  setRevealedPassIndex]  = useState(null);
  const [editRow,            setEditRow]            = useState(null);
  const client = useQueryClient();

  const initialValues = { search: "", count: 10, start_date: "", end_date: "" };
  const fk = useFormik({ initialValues, enableReinitialize: true });

  const { data, isLoading } = useQuery(
    ["get_member_list", fk.values.search, fk.values.start_date, fk.values.end_date, fk.values.count, page],
    () => apiConnectorPostAdmin(endpoint?.member_list, {
      search:     fk.values.search,
      created_at: fk.values.start_date,
      updated_at: fk.values.end_date,
      page,
      count: fk.values.count,
    }),
    { keepPreviousData: true, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false }
  );

  const allData = data?.data?.result || [];

  // ── Block / Unblock ────────────────────────────────────────────────────────
  async function toggleBlock(row) {
    const isCurrentlyBlocked = row?.lgn_is_blocked === "Yes";
    const action      = isCurrentlyBlocked ? "Unblock" : "Block";
    const confirmColor = isCurrentlyBlocked ? "#22d3ee" : "#ef4444";

    const result = await Swal.fire({
      title: `<span style="color:${confirmColor};font-size:1rem;">${action} User?</span>`,
      html: `<p style="color:#94a3b8;font-size:0.85rem;">${isCurrentlyBlocked
        ? `Allow <strong style="color:#22d3ee">${row?.lgn_name}</strong> to log in again?`
        : `Prevent <strong style="color:#ef4444">${row?.lgn_name}</strong> from logging in?`}</p>`,
      icon: isCurrentlyBlocked ? "question" : "warning",
      background: "#101827", showCancelButton: true,
      confirmButtonColor: confirmColor, cancelButtonColor: "#374151",
      confirmButtonText: `Yes, ${action}`, cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.update_profile, {
        editUserId: row?.lgn_jnr_id || row?.tr03_reg_id,
        isBlocked: !isCurrentlyBlocked,
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || `User ${action.toLowerCase()}ed.`);
        client.invalidateQueries(["get_member_list"]);
      } else { toast.error(res?.data?.message || `${action} failed.`); }
    } catch (e) { console.error(e); toast.error("Something went wrong."); }
    setLoading(false);
  }

  // ── Withdrawal permission ──────────────────────────────────────────────────
  async function toggleWithdrawal(row) {
    const isAllowed = Number(row?.tr03_active_for_payout) === 0;
    const result = await Swal.fire({
      title: `<span style="color:#22d3ee;font-size:1rem;">${isAllowed ? "Block Withdrawal" : "Allow Withdrawal"}?</span>`,
      html: `<p style="color:#94a3b8;font-size:0.85rem;">${isAllowed
        ? `Stop withdrawal for <strong style="color:#ef4444">${row?.lgn_name}</strong>?`
        : `Allow withdrawal for <strong style="color:#22d3ee">${row?.lgn_name}</strong>?`}</p>`,
      icon: "question", background: "#101827", showCancelButton: true,
      confirmButtonColor: "#22d3ee", cancelButtonColor: "#374151",
      confirmButtonText: "Yes", cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.member_withdrawal_permission, {
        customer_id: row?.tr03_reg_id, status: isAllowed ? 1 : 0,
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Withdrawal permission updated.");
        client.invalidateQueries(["get_member_list"]);
      } else { toast.error(res?.data?.message || "Failed to update withdrawal permission."); }
    } catch (e) { console.error(e); toast.error("Something went wrong."); }
    setLoading(false);
  }

  // ── Trade permission ───────────────────────────────────────────────────────
  async function toggleTrade(row) {
    const isAllowed = Number(row?.tr03_active_for_trade) === 1;
    const result = await Swal.fire({
      title: `<span style="color:#22d3ee;font-size:1rem;">Change Trade Permission?</span>`,
      html: `<p style="color:#94a3b8;font-size:0.85rem;">${isAllowed
        ? `Block trading for <strong style="color:#ef4444">${row?.lgn_name}</strong>?`
        : `Allow trading for <strong style="color:#22d3ee">${row?.lgn_name}</strong>?`}</p>`,
      icon: "question", background: "#101827", showCancelButton: true,
      confirmButtonColor: "#22d3ee", cancelButtonColor: "#374151",
      confirmButtonText: "Yes", cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.member_trade_permission, {
        customer_id: row?.tr03_reg_id, status: isAllowed ? 0 : 1,
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Trade permission updated.");
        client.invalidateQueries(["get_member_list"]);
      } else { toast.error(res?.data?.message || "Failed to update trade permission."); }
    } catch (e) { console.error(e); toast.error("Something went wrong."); }
    setLoading(false);
  }

  // ── SubAdmin Access Toggle ─────────────────────────────────────────────────
  async function toggleSubAdminAccess(row) {
    const isCurrentlySubAdmin = row?.lgn_user_type === "SubAdmin";
    const action      = isCurrentlySubAdmin ? "Revoke" : "Grant";
    const confirmColor = isCurrentlySubAdmin ? "#ef4444" : "#a855f7";

    const result = await Swal.fire({
      title: `<span style="color:${confirmColor};font-size:1rem;">${action} SubAdmin Access?</span>`,
      html: `<p style="color:#94a3b8;font-size:0.85rem;">
        ${isCurrentlySubAdmin
          ? `Remove sub-admin privileges from <strong style="color:#ef4444">${row?.lgn_name}</strong>? They will revert to a regular User.`
          : `Grant sub-admin privileges to <strong style="color:#a855f7">${row?.lgn_name}</strong>?
             <br/><span style="color:#6b7280;font-size:0.78rem;">You can configure their permissions from the SubAdmin Manager page.</span>`
        }</p>`,
      icon: isCurrentlySubAdmin ? "warning" : "question",
      background: "#101827", showCancelButton: true,
      confirmButtonColor: confirmColor, cancelButtonColor: "#374151",
      confirmButtonText: `Yes, ${action}`, cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    setSubAdminLoadingId(row?.login_id);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.toggle_subadmin_access, {
        login_id:    row?.tr03_lgn_id,
        user_type:   isCurrentlySubAdmin ? "User" : "SubAdmin",
      });

      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || `SubAdmin access ${action.toLowerCase()}ed.`);
        client.invalidateQueries(["get_member_list"]);

        // If granting, prompt admin to set permissions
        if (!isCurrentlySubAdmin) {
          const goNow = await Swal.fire({
            title: '<span style="color:#a855f7;font-size:1rem;">Access Granted!</span>',
            html: `<p style="color:#94a3b8;font-size:0.85rem;">
              <strong style="color:#a855f7">${row?.lgn_name}</strong> is now a SubAdmin.<br/>
              <span style="color:#6b7280;">Would you like to configure their permissions now?</span>
            </p>`,
            icon: "success",
            background: "#101827", showCancelButton: true,
            confirmButtonColor: "#a855f7", cancelButtonColor: "#374151",
            confirmButtonText: "Set Permissions →", cancelButtonText: "Later",
          });
          if (goNow.isConfirmed) navigate("/subadmin-permission");
        }
      } else {
        toast.error(res?.data?.message || "Failed to update SubAdmin access.");
      }
    } catch (e) { console.error(e); toast.error("Something went wrong."); }
    setSubAdminLoadingId(null);
  }

  // ── Wallet copy ────────────────────────────────────────────────────────────
  const copyWalletAddress = async (walletAddress) => {
    if (!walletAddress) { Swal.fire({ title: "Not Available", text: "Wallet address is not available.", icon: "info" }); return; }
    try {
      await navigator.clipboard.writeText(walletAddress);
      Swal.fire({ title: "Copied", text: "Wallet address copied.", icon: "success", timer: 1200, showConfirmButton: false });
    } catch { Swal.fire({ title: "Copy Failed", text: "Unable to copy wallet address.", icon: "error" }); }
  };

  // ── Table definition ───────────────────────────────────────────────────────
  const tablehead = [
    <span>S.No.</span>,
    <span>Email</span>,
    <span>Mobile</span>,
    <span>Customer Id</span>,
    <span>Name</span>,
    <span>Registration Date</span>,
    <span>Password</span>,
    <span>Spon Id</span>,
    <span>Spon Name</span>,
    <span>Wallet Address</span>,
    <span>Topup Wallet</span>,
    <span>Rank</span>,
    <span>Total Income</span>,
    <span>Current Balance</span>,
    <span>Fund Wallet</span>,
    <span>Status</span>,
    <span>Edit</span>,
    <span>Withdrawal</span>,
    <span>Trade</span>,
    // ── New column ──
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block" />
      SubAdmin
    </span>,
    <span>Block</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => {
    const isBlocked        = row?.lgn_is_blocked === "Yes";
    const isSubAdmin       = row?.lgn_user_type === "SubAdmin";
    const isThisRowLoading = subAdminLoadingId === row?.login_id;

    return [
      // S.No.
      <span>{(page - 1) * (fk.values.count || 10) + index + 1}</span>,
      <span>{row.lgn_email}</span>,
      <span>{row.lgn_mobile}</span>,

      // Customer ID — clickable
      <span className="text-cyan-400 cursor-pointer hover:underline"
        onClick={() => {
          localStorage.setItem("logindataen", row.lgn_token);
          localStorage.setItem("login_user", "User");
          window.open(frontend + "/dashboard", "_blank");
        }}
      >{row.lgn_cust_id}</span>,

      <span>{row.lgn_name || "N/A"}</span>,
      <span>{formatedDate(moment,row.tr03_reg_date)}</span>,

      // Password reveal
      <span>
        {revealedPassIndex === index
          ? <span className="cursor-pointer text-cyan-400 font-mono" onClick={() => setRevealedPassIndex(null)}>{row.lgn_pass || "N/A"}</span>
          : <span className="cursor-pointer text-cyan-400 font-mono" onClick={() => setRevealedPassIndex(index)}>{row.lgn_pass ? "•••••••" : "N/A"}</span>
        }
      </span>,

      <span>{row.spon_id   || "N/A"}</span>,
      <span>{row.spon_name || "N/A"}</span>,

      // Wallet
      <span className="flex items-center gap-2">
        <span className="max-w-[150px] truncate font-mono" title={row.lgn_wallet_add || "N/A"}>{row.lgn_wallet_add || "N/A"}</span>
        <button type="button" onClick={() => copyWalletAddress(row.lgn_wallet_add)}
          className="px-2 py-1 text-[10px] rounded border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10">Copy</button>
      </span>,

      <span>{getFloatingValue(row.tr03_topup_wallet)}</span>,
      <span>{row.tr03_rank > 0 ? "V" + row.tr03_rank : "--"}</span>,
      <span>{getFloatingValue(row.tr03_total_income)}</span>,
      <span>{getFloatingValue(row.tr03_inc_wallet)}</span>,
      <span>{getFloatingValue(row.tr03_fund_wallet)}</span>,

      // Status badge
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
        style={isBlocked
          ? { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }
          : { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", color: "#4ade80" }}
      >{isBlocked ? "Blocked" : "Active"}</span>,

      // Edit
      <button title="Edit Profile" onClick={() => setEditRow(row)} className="p-1 rounded-lg hover:bg-cyan-400/10 transition-colors">
        <Edit sx={{ color: "#749df5", fontSize: 20 }} />
      </button>,

      // Withdrawal
      <Switch checked={Number(row?.tr03_active_for_payout) === 1} onChange={() => toggleWithdrawal(row)} color="success" />,

      // Trade
      <Switch checked={Number(row?.tr03_active_for_trade) === 1} onChange={() => toggleTrade(row)} color="success" />,

      // ── SubAdmin Access (new) ──────────────────────────────────────────────
      <div className="flex flex-col items-center gap-1">
        <SubAdminToggle
          enabled={isSubAdmin}
          onChange={() => toggleSubAdminAccess(row)}
          loading={isThisRowLoading}
        />
        {isSubAdmin && (
          <span
            onClick={() => navigate("/subadmin-permission")}
            className="text-[9px] text-purple-400 hover:text-purple-300 cursor-pointer underline underline-offset-2 transition-colors"
            title="Manage permissions"
          >
            Permissions
          </span>
        )}
      </div>,

      // Block / Unblock
      <button
        title={isBlocked ? "Unblock User" : "Block User"}
        onClick={() => toggleBlock(row)}
        className="p-1 rounded-lg transition-colors"
        style={{ background: isBlocked ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}
        onMouseEnter={e => e.currentTarget.style.background = isBlocked ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)"}
        onMouseLeave={e => e.currentTarget.style.background = isBlocked ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"}
      >
        {isBlocked
          ? <CheckCircle sx={{ color: "#4ade80", fontSize: 20 }} />
          : <Block      sx={{ color: "#f87171", fontSize: 20 }} />
        }
      </button>,
    ];
  });

  return (
    <div className="p-2">
      <CustomTableSearch fk={fk} onClearFn={() => setPage(1)}
        onSubmitFn={() => { setPage(1); client.invalidateQueries(["get_member_list"]); }}
      />
      <div className="rounded-lg py-3 text-white bg-black border border-gray-700 shadow-md shadow-white/20">
        <CustomTable tablehead={tablehead} tablerow={tablerow} isLoading={isLoading || loading} />
        <CustomToPagination page={page} setPage={setPage} data={allData} count={fk.values.count}
          onCountChange={(value) => { fk.setFieldValue("count", value); setPage(1); }}
        />
      </div>

      {editRow && (
        <EditProfileModal row={editRow} onClose={() => setEditRow(null)}
          onSaved={() => client.invalidateQueries(["get_member_list"])}
        />
      )}
    </div>
  );
};

export default MemberList;