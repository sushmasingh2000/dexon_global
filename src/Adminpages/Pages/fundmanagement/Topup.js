import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../../../Shared/Loader";

const TopUp = () => {
  const [loding, setLoding] = useState(false);
  const [sponsername, setSponsername] = useState("");

  const initialValues = {
    user_id: "",
    topup_amnt: "",
    topup_desc: "",
    transaction_type: "credit",
    wallet_type: "fund", // default to Fund Wallet
    topup_plan: "dglite",
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

    onSubmit: () => {
      const reqbody = {
        to_cust_id: fk.values.user_id,
        pkg_id: 1,
        pkg_amount: fk.values.topup_amnt,
        wallet_type: fk.values.wallet_type === "fund" ? "fund_wallet" : "topup_wallet",
        transaction_type: fk.values.transaction_type,
      };
      TopUpFn(reqbody);
    },
  });

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
      setLoding(true)
      const res = await apiConnectorPostAdmin(endpoint?.member_fund_transfer, reqbody);
      if (res?.data?.success) {
        Swal.fire({
          icon: 'success',
          title: res.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'TopUp Failed',
          text: res?.data?.message,
        });
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: 'error',
        title: 'TopUp Failed',
        text: 'An error occurred during top-up.',
      });
    }
    setLoding(false);
  }

  const getSponserName = async () => {
    try {
      const response = await axios.post(
        endpoint?.get_spon_name,
        { customer_id: fk.values.user_id },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response?.data?.success) {
        setSponsername(response?.data?.result?.[0]?.lgn_name);
      } else {
        setSponsername("Invalid Sponser");
      }
    } catch (error) {
      setSponsername("Error fetching sponser");
    }
  };

  useEffect(() => {
    if (fk.values.user_id) {
      getSponserName();
    }
  }, [fk.values.user_id]);

  const areYouSureFn = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with this TopUp?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "blue",
      confirmButtonText: "Yes, Submit",
    });

    if (result.isConfirmed) {
      fk.handleSubmit();
    }
  };

  // Drop-in replacement for your Add TopUp form return block

  return (
    <div className="flex justify-center items-start w-full py-4">
      <Loader isLoading={loding} />
      <div
        className="w-full lg:w-1/2 md:w-3/4 rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, rgba(10,18,25,0.97) 0%, rgba(13,24,33,0.95) 100%)',
          border: '1px solid rgba(34,211,238,0.15)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.04)',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Left edge glow */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 via-cyan-400/15 to-transparent" />

        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-cyan-400/10 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cyan-400/06 rounded-bl-2xl pointer-events-none" />

        {/* Background glow blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(34,211,238,0.03)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.03)' }} />

        {/* ─── HEADER ─── */}
        <div
          className="relative px-7 py-5"
          style={{ borderBottom: '1px solid rgba(34,211,238,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.08) 100%)',
                border: '1px solid rgba(34,211,238,0.25)',
                boxShadow: '0 0 12px rgba(34,211,238,0.1)',
              }}
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2
                className="text-lg font-bold tracking-wide"
                style={{
                  background: 'linear-gradient(90deg, #cffafe, #67e8f9, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Add TopUp
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Fund a user's wallet balance</p>
            </div>
          </div>

          {/* Status dot */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-gray-600 tracking-widest uppercase">Secure</span>
          </div>
        </div>

        {/* ─── FORM BODY ─── */}
        <div className="relative z-10 px-7 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-6 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-300">Transacton Type</span>
            <label className="flex items-center gap-2 text-sm text-cyan-200">
              <input
                type="radio"
                name="transaction_type"
                value="credit"
                checked={fk.values.transaction_type === "credit"}
                onChange={fk.handleChange}
                className="form-radio text-cyan-400"
              />
              Credit
            </label>
            {/* <label className="flex items-center gap-2 text-sm text-cyan-200">
              <input
                type="radio"
                name="transaction_type"
                value="debit"
                checked={fk.values.transaction_type === "debit"}
                onChange={fk.handleChange}
                className="form-radio text-cyan-400"
              />
              Debit
            </label> */}
          </div>

          {/* Wallet Type Boolean Field */}
          <div className="flex items-center gap-6 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-300">Wallet Type</span>
            <label className="flex items-center gap-2 text-sm text-cyan-200">
              <input
                type="radio"
                name="wallet_type"
                value="fund"
                checked={fk.values.wallet_type === "fund"}
                onChange={fk.handleChange}
                className="form-radio text-cyan-400"
              />
              Fund Wallet
            </label>
            <label className="flex items-center gap-2 text-sm text-cyan-200">
              <input
                type="radio"
                name="wallet_type"
                value="topup"
                checked={fk.values.wallet_type === "topup"}
                onChange={fk.handleChange}
                className="form-radio text-cyan-400"
              />
              Topup Wallet
            </label>
          </div>
          {fk.values.wallet_type === "topup" && (
            <div className="mb-4 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="radio"
                  name="topup_plan"
                  value="dglite"
                  onChange={fk.handleChange}
                  checked={fk.values.topup_plan === "dglite"}
                  className="form-radio text-cyan-400"
                />
                DGLite (10-499) USD
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="radio"
                  name="topup_plan"
                  value="dgpro"
                  onChange={fk.handleChange}
                  checked={fk.values.topup_plan === "dgpro"}
                  className="form-radio text-cyan-400"
                />
                DGPro (500 or above) USD
              </label>
            </div>
          )}
          {/* User ID */}
          <div className="relative">
            <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
              style={{ color: 'rgba(34,211,238,0.7)', background: 'rgba(10,18,25,1)' }}>
              User ID
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: 'rgba(34,211,238,0.3)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                fullWidth
                id="user_id"
                name="user_id"
                value={fk.values.user_id}
                onChange={fk.handleChange}
                placeholder="Enter user ID"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                style={{
                  background: 'rgba(34,211,238,0.04)',
                  border: '1px solid rgba(34,211,238,0.14)',
                  color: 'rgba(224,242,254,0.9)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.07)';
                  e.target.style.background = 'rgba(34,211,238,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(34,211,238,0.04)';
                }}
              />
              <span className="!text-red-500 !text-[10px]">{sponsername}</span>
            </div>
          </div>

          {/* TopUp Amount */}
          <div className="relative">
            <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
              style={{ color: 'rgba(34,211,238,0.7)', background: 'rgba(10,18,25,1)' }}>
              TopUp Amount
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: 'rgba(34,211,238,0.3)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input
                id="topup_amnt"
                name="topup_amnt"
                type="number"
                min="0"
                value={fk.values.topup_amnt}
                onChange={fk.handleChange}
                placeholder="0.00"
                className="w-full pl-10 pr-16 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                style={{
                  background: 'rgba(34,211,238,0.04)',
                  border: '1px solid rgba(34,211,238,0.14)',
                  color: 'rgba(224,242,254,0.9)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.07)';
                  e.target.style.background = 'rgba(34,211,238,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(34,211,238,0.04)';
                }}
              />
              {/* USDT badge */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                style={{
                  color: 'rgba(34,211,238,0.6)',
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.15)',
                }}
              >
                USDT
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded z-10"
              style={{ color: 'rgba(34,211,238,0.7)', background: 'rgba(10,18,25,1)' }}>
              Description
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-3.5 w-4 h-4 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: 'rgba(34,211,238,0.3)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <textarea
                id="topup_desc"
                name="topup_desc"
                rows={3}
                value={fk.values.topup_desc}
                onChange={fk.handleChange}
                placeholder="Optional note or reason…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-600 resize-none"
                style={{
                  background: 'rgba(34,211,238,0.04)',
                  border: '1px solid rgba(34,211,238,0.14)',
                  color: 'rgba(224,242,254,0.9)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.07)';
                  e.target.style.background = 'rgba(34,211,238,0.06)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(34,211,238,0.04)';
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── FOOTER / ACTIONS ─── */}
        <div
          className="relative z-10 px-7 py-5 flex items-center justify-end gap-3"
          style={{ borderTop: '1px solid rgba(34,211,238,0.08)' }}
        >
          {/* Clear */}
          <button
            onClick={() => fk.handleReset()}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
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
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>

          {/* Submit */}
          <button
            onClick={areYouSureFn}
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(14,116,144,0.16) 100%)',
              border: '1px solid rgba(34,211,238,0.35)',
              color: 'rgba(34,211,238,0.95)',
              boxShadow: '0 0 16px rgba(34,211,238,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6,182,212,0.32) 0%, rgba(14,116,144,0.24) 100%)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(34,211,238,0.22)';
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(14,116,144,0.16) 100%)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(34,211,238,0.1)';
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)';
            }}
          >
            {/* Shine sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="relative z-10">Submit TopUp</span>
          </button>
        </div>

        {/* Floating particles */}
        <div className="absolute top-16 right-8 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 left-10 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping pointer-events-none" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default TopUp;
