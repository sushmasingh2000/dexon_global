import { useFormik } from "formik";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { enCryptData } from "../../utils/Secret";
import { getFloatingValue } from "../../utils/utilityFun";

function Payout() {
  const [loding, setLoding] = useState(false);
  const location = useLocation();
  const navi = useNavigate();
  const client = useQueryClient();

  const params = new URLSearchParams(location?.search);
  const IdParam = params?.get("token");
  const base64String = atob(IdParam);
  const fk = useFormik({
    initialValues: {
      amount: "",
      walletAddress: "",
      wallet_type: "fund", // default
    },
    enableReinitialize: true,
  });

  async function Payout() {
    const reqbody = {
      wallet_address: String(fk.values.walletAddress)?.trim(),
      user_amount: Number(fk.values.amount)?.toFixed(3),
      wallet_type: fk.values.wallet_type === "fund" ? "fund_wallet" : fk.values.wallet_type === "profit" ? "income_wallet" : "topup_wallet",
    };


    if (!reqbody?.wallet_address || !reqbody?.user_amount) {
      Swal.fire({
        title: "⚠️ Incomplete Information",
        html: `<p style="font-size:14px; margin-bottom:8px;">Please provide both wallet address and amount.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    setLoding(true);

    try {
      const res = await apiConnectorPost(
        endpoint?.member_payout,
        {
          payload: enCryptData(reqbody),
        },
        base64String
      );
      // setData(res?.data?.result?.[0]);
      if (res.data?.success) {
        fk.handleReset();
      }
      Swal.fire({
        title:
          String(res?.data?.success) === "true" ? "🎉 Congratulations!" : "",
        html:
          String(res?.data?.success) === "true"
            ? `
            <p style="font-size:14px; margin-bottom:8px;">${res?.data?.message}</p>
          `
            : `<p style="font-size:14px; margin-bottom:8px;">${res?.data?.message}</p>`,
        icon: String(res?.data?.success) === "true" ? "success" : "",
        confirmButtonColor: "black",
      });
      if (String(res?.data?.success) === "true") {
        client.refetchQueries("get_payout_report");
        client.refetchQueries("get_profile");
        navi("/payout-report")
      }
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  const { data: profile, refetch: refetchProfile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || [];

  // Fixed Withdrawal Component — drop-in replacement for your return block

  return (
    <>
      <Loader isLoading={loding} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-8 px-2">
        <div className="w-full max-w-md bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/30 rounded-2xl py-8 px-2 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">

          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/10 rounded-bl-2xl pointer-events-none"></div>

          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent pointer-events-none"></div>

          {/* Content Container */}
          <div className="relative z-10">

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/10 flex items-center justify-center border border-cyan-400/30 flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-2xl font-bold">
                    Withdrawal
                  </h2>
                  <p className="text-gray-400 text-xs">Request payout from wallet</p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-gray-400 text-xs">Secure Transaction</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>

            {/* Wallet Balance Card */}
            <div className="mb-4 bg-gradient-to-br from-green-950/40 to-emerald-900/30 rounded-xl p-5 border border-green-400/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Available Balance Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Balance
                  </div>
                  <span className="text-green-400 font-bold text-lg">
                    ${getFloatingValue(fk.values.wallet_type === "fund" ? user_profile?.tr03_fund_wallet : fk.values.wallet_type === "profit" ? user_profile?.tr03_inc_wallet : user_profile?.tr03_topup_wallet)}
                    <span className="text-gray-400 text-xs font-normal ml-1">USDT</span>
                  </span>
                </div>

                {/* Wallet Type Radio */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="wallet_type"
                      value="fund"
                      onChange={fk.handleChange}
                      checked={fk.values.wallet_type === "fund"}
                      className="form-radio text-cyan-400 accent-cyan-400"
                    />
                    Fund Wallet
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="wallet_type"
                      value="profit"
                      onChange={fk.handleChange}
                      checked={fk.values.wallet_type === "profit"}
                      className="form-radio text-cyan-400 accent-cyan-400"
                    />
                    Profit Wallet
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="wallet_type"
                      value="topup"
                      onChange={fk.handleChange}
                      checked={fk.values.wallet_type === "topup"}
                      className="form-radio text-cyan-400 accent-cyan-400"
                    />
                    Topup Wallet
                  </label>
                </div>


                {/* Wallet Address Field */}
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2 mt-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Wallet Address
                </div>
                <div className="relative group mb-3">
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    value={fk.values.walletAddress || user_profile?.lgn_wallet_add || ""}
                    onChange={fk.handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold"
                  />
                </div>

                {/* Withdrawal Amount Label */}
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Withdrawal Amount
                </div>

                {/* Amount Input */}
                <div className="relative group">
                  <input
                    placeholder="0.00"
                    id="amount"
                    name="amount"
                    value={fk.values.amount}
                    onChange={fk.handleChange}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 pr-16 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold placeholder:text-gray-500"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
                    USDT
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[25, 50, 100, 'Max'].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (amt === 'Max') {
                          fk.setFieldValue('amount', getFloatingValue(fk.values.wallet_type === "fund" ? user_profile?.tr03_fund_wallet : fk.values.wallet_type === "profit" ? user_profile?.tr03_inc_wallet : user_profile?.tr03_topup_wallet));
                        } else {
                          fk.setFieldValue('amount', amt);
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-cyan-900/20 border border-cyan-400/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/40 hover:border-cyan-400/40 transition-all duration-200"
                    >
                      {amt === 'Max' ? 'Max' : `$${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="mb-6 flex items-start gap-3 bg-amber-950/30 border border-amber-400/30 rounded-lg p-4">
              <svg
                className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>

              <div>
                <p className="text-amber-300 text-xs font-semibold mb-1">Important Notice</p>
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  Withdrawals are processed automatically. Minimum withdrawal amount is $1.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={Payout}
              type="button"
              className="relative w-full py-4 rounded-xl font-bold text-base overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Request Withdrawal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </div>
            </button>

            {/* Processing info */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secured with SSL encryption</span>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping pointer-events-none"></div>
          <div className="absolute bottom-32 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-20 w-1 h-1 bg-cyan-500 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <style jsx>{`
      .bg-size-200 { background-size: 200% 100%; }
      .bg-pos-0 { background-position: 0% 0%; }
      .bg-pos-100 { background-position: 100% 0%; }
    `}</style>
    </>
  );
}
export default Payout;
