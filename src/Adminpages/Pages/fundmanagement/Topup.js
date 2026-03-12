import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../../../Shared/Loader";

// ─── OTP Modal ───────────────────────────────────────────────────────────────
const OTPModal = ({ isOpen, onVerify, onCancel, isVerifying, error }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "Enter" && otp.every((d) => d)) onVerify(otp.join(""));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  if (!isOpen) return null;
  const filledCount = otp.filter((d) => d).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10,18,25,0.99) 0%, rgba(13,24,33,0.97) 100%)",
          border: "1px solid rgba(34,211,238,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 60px rgba(34,211,238,0.06)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(34,211,238,0.06)" }} />

        <div className="relative z-10 px-8 py-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.08) 100%)", border: "1px solid rgba(34,211,238,0.3)", boxShadow: "0 0 20px rgba(34,211,238,0.15)" }}>
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold tracking-wide mb-1"
              style={{ background: "linear-gradient(90deg, #cffafe, #67e8f9, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              2-Step Verification
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter the 6-digit code from your<br />authenticator app to confirm this TopUp
            </p>
          </div>

          <div className="flex gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputRefs.current[i] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="text-center text-xl font-bold rounded-xl outline-none transition-all duration-200"
                style={{
                  width: "44px", height: "52px",
                  background: digit ? "rgba(34,211,238,0.1)" : "rgba(34,211,238,0.04)",
                  border: digit ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(34,211,238,0.14)",
                  color: "rgba(224,242,254,0.95)",
                  boxShadow: digit ? "0 0 12px rgba(34,211,238,0.12)" : "none",
                  caretColor: "rgba(34,211,238,0.8)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = digit ? "rgba(34,211,238,0.5)" : "rgba(34,211,238,0.14)"; e.target.style.boxShadow = digit ? "0 0 12px rgba(34,211,238,0.12)" : "none"; }}
              />
            ))}
          </div>

          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-200"
                style={{ width: i < filledCount ? "16px" : "6px", height: "6px", background: i < filledCount ? "rgba(34,211,238,0.8)" : "rgba(34,211,238,0.15)" }} />
            ))}
          </div>

          {error && (
            <div className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(252,165,165,0.9)" }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={isVerifying}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "rgba(252,165,165,0.75)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.13)"; e.currentTarget.style.color = "rgba(252,165,165,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "rgba(252,165,165,0.75)"; }}>
              Cancel
            </button>
            <button onClick={() => otp.every((d) => d) && onVerify(otp.join(""))}
              disabled={!otp.every((d) => d) || isVerifying}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: otp.every((d) => d) ? "linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(14,116,144,0.18) 100%)" : "rgba(34,211,238,0.04)",
                border: `1px solid ${otp.every((d) => d) ? "rgba(34,211,238,0.4)" : "rgba(34,211,238,0.1)"}`,
                color: otp.every((d) => d) ? "rgba(34,211,238,0.95)" : "rgba(34,211,238,0.3)",
                cursor: otp.every((d) => d) && !isVerifying ? "pointer" : "not-allowed",
              }}>
              {isVerifying ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {isVerifying ? "Verifying…" : "Verify & Submit"}
            </button>
          </div>

          <p className="text-[10px] text-gray-600 text-center">Open your authenticator app to get the current code</p>
        </div>
      </div>
    </div>
  );
};

// ─── Main TopUp Component ─────────────────────────────────────────────────────
const TopUp = () => {
  const [loading, setLoading] = useState(false);
  const [sponsername, setSponsername] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const initialValues = {
    user_id: "",
    topup_amnt: "",
    topup_desc: "",
    transaction_type: "credit",
    wallet_type: "fund",
    topup_plan: "dglite",
  };

  const fk = useFormik({ initialValues, enableReinitialize: true, onSubmit: () => {} });

  // ── Step 1: Validate → open OTP modal ──────────────────────────────────────
  const areYouSureFn = async () => {
    const topup_amnt = Number(fk.values.topup_amnt || 0);
    if (!fk.values.user_id) { Swal.fire({ text: "Please enter a User ID", confirmButtonColor: "black", icon: "warning" }); return; }
    if (!topup_amnt) { Swal.fire({ text: "Please enter a valid TopUp amount", confirmButtonColor: "black", icon: "warning" }); return; }
    if (fk.values.wallet_type === "topup") {
      if (fk.values.topup_plan === "dglite" && (topup_amnt < 10 || topup_amnt > 499)) { Swal.fire({ text: "For DGLite, amount should be between 10 and 499", confirmButtonColor: "black", icon: "warning" }); return; }
      if (fk.values.topup_plan === "dgpro" && topup_amnt < 500) { Swal.fire({ text: "For DGPro, amount should be 500 or above", confirmButtonColor: "black", icon: "warning" }); return; }
    }
    setOtpError("");
    setShowOTPModal(true);
  };

  const handleOTPVerify = async (otpCode) => {
  setIsVerifying(true);
  setOtpError("");

  try {
    const verifyRes = await apiConnectorPostAdmin(
      endpoint?.verify_totp,
      { otp: otpCode },
    );

    if (verifyRes?.data?.success) {
      setShowOTPModal(false);

      TopUpFn({
        to_cust_id: fk.values.user_id,
        pkg_id: 1,
        pkg_amount: fk.values.topup_amnt,
        wallet_type:
          fk.values.wallet_type === "fund"
            ? "fund_wallet"
            : "topup_wallet",
        transaction_type: fk.values.transaction_type,
      });
    } else {
      setOtpError("Invalid code. Please try again.");
    }
  } catch (err) {
    console.log("FULL OTP ERROR:", err);
    console.log("OTP RESPONSE DATA:", err.response?.data);
    setOtpError(err.response?.data?.message || err.message);
  } finally {
    setIsVerifying(false);
  }
};

  // ── TopUp API ───────────────────────────────────────────────────────────────
  async function TopUpFn(reqbody) {
    const topup_amnt = Number(fk.values.topup_amnt || 0);
    if (fk.values.wallet_type === "topup") {
      if (fk.values.topup_plan === "dglite" && (topup_amnt < 10 || topup_amnt > 499)) {
        Swal.fire({ text: "For DGLite, amount should be between 10 and 499", confirmButtonColor: "black", icon: "warning" });
        return;
      }

      if (fk.values.topup_plan === "dgpro" && topup_amnt < 500) {
        Swal.fire({ text: "For DGPro, amount should be 500 or above", confirmButtonColor: "black", icon: "warning" });
        return;
      }
    }
    try {
      setLoading(true)
      const res = await apiConnectorPostAdmin(endpoint?.member_fund_transfer, reqbody);
      if (res?.data?.success) {
        Swal.fire({ icon: "success", title: res.data?.message });
        fk.resetForm();
      } else {
        Swal.fire({ icon: "error", title: "TopUp Failed", text: res?.data?.message });
      }
    } catch (e) {
      Swal.fire({ icon: "error", title: "TopUp Failed", text: "An error occurred during top-up." });
    } finally {
      setLoading(false);
    }
  }

  // ── Sponsor lookup ──────────────────────────────────────────────────────────
  const getSponserName = async () => {
    try {
      const response = await axios.post(endpoint?.get_spon_name, { customer_id: fk.values.user_id },
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      setSponsername(response?.data?.success ? response?.data?.result?.[0]?.lgn_name : "Invalid Sponser");
    } catch { setSponsername("Error fetching sponser"); }
  };

  useEffect(() => {
    if (fk.values.user_id) getSponserName();
    else setSponsername("");
  }, [fk.values.user_id]);

  return (
    <>
      <OTPModal isOpen={showOTPModal} onVerify={handleOTPVerify}
        onCancel={() => { setShowOTPModal(false); setOtpError(""); }}
        isVerifying={isVerifying} error={otpError} />

      <div className="flex justify-center items-start w-full py-4">
        <Loader isLoading={loading} />
        <div className="w-full lg:w-1/2 md:w-3/4 rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, rgba(10,18,25,0.97) 0%, rgba(13,24,33,0.95) 100%)", border: "1px solid rgba(34,211,238,0.15)", boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.04)" }}>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 via-cyan-400/15 to-transparent" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-cyan-400/10 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cyan-400/06 rounded-bl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(34,211,238,0.03)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(59,130,246,0.03)" }} />

          {/* HEADER */}
          <div className="relative px-7 py-5" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.08) 100%)", border: "1px solid rgba(34,211,238,0.25)", boxShadow: "0 0 12px rgba(34,211,238,0.1)" }}>
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide"
                  style={{ background: "linear-gradient(90deg, #cffafe, #67e8f9, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Add TopUp
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">Fund a user's wallet balance</p>
              </div>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <svg className="w-3 h-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase">2FA Protected</span>
            </div>
          </div>

          {/* FORM */}
          <div className="relative z-10 px-7 py-6 flex flex-col gap-5">
            <div className="flex items-center gap-6 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-300">Transaction Type</span>
              <label className="flex items-center gap-2 text-sm text-cyan-200">
                <input type="radio" name="transaction_type" value="credit" checked={fk.values.transaction_type === "credit"} onChange={fk.handleChange} />
                Credit
              </label>
            </div>

            <div className="flex items-center gap-6 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-300">Wallet Type</span>
              <label className="flex items-center gap-2 text-sm text-cyan-200">
                <input type="radio" name="wallet_type" value="fund" checked={fk.values.wallet_type === "fund"} onChange={fk.handleChange} /> Fund Wallet
              </label>
              <label className="flex items-center gap-2 text-sm text-cyan-200">
                <input type="radio" name="wallet_type" value="topup" checked={fk.values.wallet_type === "topup"} onChange={fk.handleChange} /> Topup Wallet
              </label>
            </div>

            {fk.values.wallet_type === "topup" && (
              <div className="mb-4 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="radio" name="topup_plan" value="dglite" onChange={fk.handleChange} checked={fk.values.topup_plan === "dglite"} /> DGLite (10–499) USD
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="radio" name="topup_plan" value="dgpro" onChange={fk.handleChange} checked={fk.values.topup_plan === "dgpro"} /> DGPro (500 or above) USD
                </label>
              </div>
            )}

            {/* User ID */}
            <div className="relative">
              <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
                style={{ color: "rgba(34,211,238,0.7)", background: "rgba(10,18,25,1)" }}>User ID</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "rgba(34,211,238,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input id="user_id" name="user_id" value={fk.values.user_id} onChange={fk.handleChange} placeholder="Enter user ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                  style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.14)", color: "rgba(224,242,254,0.9)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)"; e.target.style.background = "rgba(34,211,238,0.06)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.14)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(34,211,238,0.04)"; }} />
                {sponsername && <span className="!text-red-500 !text-[10px] mt-1 block pl-1">{sponsername}</span>}
              </div>
            </div>

            {/* Amount */}
            <div className="relative">
              <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
                style={{ color: "rgba(34,211,238,0.7)", background: "rgba(10,18,25,1)" }}>TopUp Amount</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "rgba(34,211,238,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input id="topup_amnt" name="topup_amnt" type="number" min="0" value={fk.values.topup_amnt} onChange={fk.handleChange} placeholder="0.00"
                  className="w-full pl-10 pr-16 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                  style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.14)", color: "rgba(224,242,254,0.9)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)"; e.target.style.background = "rgba(34,211,238,0.06)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.14)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(34,211,238,0.04)"; }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                  style={{ color: "rgba(34,211,238,0.6)", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>USDT</div>
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
                style={{ color: "rgba(34,211,238,0.7)", background: "rgba(10,18,25,1)" }}>Description</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-3.5 w-4 h-4 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "rgba(34,211,238,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <textarea id="topup_desc" name="topup_desc" rows={3} value={fk.values.topup_desc} onChange={fk.handleChange} placeholder="Optional note or reason…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600 resize-none"
                  style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.14)", color: "rgba(224,242,254,0.9)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)"; e.target.style.background = "rgba(34,211,238,0.06)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.14)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(34,211,238,0.04)"; }} />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="relative z-10 px-7 py-5 flex items-center justify-end gap-3" style={{ borderTop: "1px solid rgba(34,211,238,0.08)" }}>
            <button onClick={() => fk.handleReset()} type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "rgba(252,165,165,0.75)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.13)"; e.currentTarget.style.color = "rgba(252,165,165,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "rgba(252,165,165,0.75)"; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>

            <button onClick={areYouSureFn} type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(14,116,144,0.16) 100%)", border: "1px solid rgba(34,211,238,0.35)", color: "rgba(34,211,238,0.95)", boxShadow: "0 0 16px rgba(34,211,238,0.1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(6,182,212,0.32) 0%, rgba(14,116,144,0.24) 100%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(34,211,238,0.22)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(14,116,144,0.16) 100%)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(34,211,238,0.1)"; }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="relative z-10">Submit TopUp</span>
            </button>
          </div>

          <div className="absolute top-16 right-8 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
          <div className="absolute bottom-20 left-10 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping pointer-events-none" style={{ animationDuration: "3s", animationDelay: "1s" }} />
        </div>
      </div>
    </>
  );
};

export default TopUp;