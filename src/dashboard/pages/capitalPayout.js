import { useFormik } from "formik";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { enCryptData } from "../../utils/Secret";
import { getFloatingValue, swalAlert } from "../../utils/utilityFun";

function CapitalWithdraw() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navi = useNavigate();
  const client = useQueryClient();

  const params = new URLSearchParams(location?.search);
  const IdParam = params?.get("token");
  const base64String = atob(IdParam);

  const fk = useFormik({
    initialValues: {
      amount: "",
      growth_option: "",
    },
    enableReinitialize: true,
  });

  // ── Profile — always fetch on mount so wallet is ready before submit ──
  const { data: profile, isLoading: profileLoading } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: true,        // ← KEY FIX: always load fresh on mount
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || {};

  // Resolved wallet — single source of truth used everywhere
  const resolvedWallet = String(user_profile?.lgn_wallet_add || "").trim();

  // ── Capital packages ──
  const { data, isLoading } = useQuery(
    ["capital_withdraw"],
    () =>
      apiConnectorPost(endpoint?.get_report_details, {
        count: "10",
        sub_label: "TOPUP WALLET",
        main_label: "IN",
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching capital data:", err),
    }
  );

  const rawResult = data?.data?.result;
  const allData = Array.isArray(rawResult)
    ? rawResult
    : Array.isArray(rawResult?.data)
    ? rawResult?.data
    : Array.isArray(rawResult?.rows)
    ? rawResult?.rows
    : [];

  // Only unlocked packages with available capital balance
  const capitalPackages = allData.filter((item) => {
    const available = parseFloat(item.tr09_real_amount || 0) - parseFloat(item.tr09_withdraw_amount || 0);
    return available > 0;
  });

  const selectedPackage = allData.find(
    (item) => `${item.tr07_trans_id}` === fk.values.growth_option
  );

  const maxAmount = selectedPackage
    ? parseFloat(selectedPackage.tr09_real_amount - selectedPackage.tr09_withdraw_amount)
    : 0;

  async function handleWithdraw() {
    // ── 1. Wallet must be loaded and non-empty ──
    if (!resolvedWallet || resolvedWallet === "undefined") {
      Swal.fire({
        title: "⚠️ Wallet Not Loaded",
        html: `<p style="font-size:14px;">Your wallet address is not available yet. Please wait a moment and try again.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    // ── 2. Package must be selected (backend requires package_id for capital_wallet) ──
    const packageId = selectedPackage?.tr09_id || null;
    if (!packageId) {
      Swal.fire({
        title: "⚠️ Select a Package",
        html: `<p style="font-size:14px;">Please select a capital package to withdraw from.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    // ── 3. Amount must be valid and within max ──
    const parsedAmount = parseFloat(fk.values.amount);
    if (!fk.values.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({
        title: "⚠️ Invalid Amount",
        html: `<p style="font-size:14px;">Please enter a valid withdrawal amount.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    if (parsedAmount < 1) {
      Swal.fire({
        title: "⚠️ Minimum Amount",
        html: `<p style="font-size:14px;">Minimum withdrawal amount is $1.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    if (parsedAmount > maxAmount) {
      Swal.fire({
        title: "⚠️ Exceeds Balance",
        html: `<p style="font-size:14px;">Amount exceeds available balance of $${maxAmount.toFixed(2)}.</p>`,
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    // ── 4. Build payload — wallet comes from profile, never from formik state ──
    const reqbody = {
      wallet_address: resolvedWallet,           // ← always from profile, never undefined
      user_amount: parsedAmount.toFixed(3),
      wallet_type: "capital_wallet",
      package_id: packageId,
    };

    console.log("Capital withdraw payload (pre-encrypt):", reqbody); // debug — remove in prod

    setLoading(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.member_payout,
        { payload: enCryptData(reqbody) },
        base64String
      );

      if (String(res?.data?.success) === "true") {
        fk.handleReset();
      }

      Swal.fire({
        title: String(res?.data?.success) === "true" ? "🎉 Congratulations!" : "❌ Failed",
        html: `<p style="font-size:14px;">${res?.data?.message}</p>`,
        icon: String(res?.data?.success) === "true" ? "success" : "error",
        confirmButtonColor: "black",
      });

      if (String(res?.data?.success) === "true") {
        client.refetchQueries("get_payout_report");
        client.refetchQueries("get_profile");
        navi("/payout-report");
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "❌ Error",
        html: `<p style="font-size:14px;">Something went wrong. Please try again.</p>`,
        icon: "error",
        confirmButtonColor: "black",
      });
    }
    setLoading(false);
  }

  const navigate = useNavigate();
    if (user_profile.lgn_update_prof === "Deactive") {
      swalAlert(
        Swal,
        "Warning",
        "Please update all required fields in your profile to withdraw funds",
        () => navigate("/Profile")
      );
    }

  return (
    <>
      <Loader isLoading={loading} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-8 px-2">
        <div className="w-full max-w-md bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/30 rounded-2xl py-8 px-6 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">

          {/* Background glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/10 rounded-bl-2xl pointer-events-none" />

          {/* Left accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent pointer-events-none" />

          {/* Floating particles */}
          <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping pointer-events-none" />
          <div className="absolute bottom-32 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-20 w-1 h-1 bg-cyan-500 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDelay: "2s" }} />

          <div className="relative z-10">

            {/* ── Header ── */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/10 flex items-center justify-center border border-cyan-400/30 flex-shrink-0">
                  {/* Vault / capital icon */}
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-9 5a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-2xl font-bold">
                    Capital Withdrawal
                  </h2>
                  <p className="text-gray-400 text-xs">Withdraw from your capital packages</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-gray-400 text-xs">Secure Transaction</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            </div>

            {/* ── Main Card ── */}
            <div className="mb-4 bg-gradient-to-br from-green-950/40 to-emerald-900/30 rounded-xl p-5 border border-green-400/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">

                {/* Wallet Address */}
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Wallet Address
                  {/* Show warning if wallet not loaded */}
                  {!profileLoading && !resolvedWallet && (
                    <span className="ml-auto text-red-400 text-xs font-semibold animate-pulse">
                      ⚠️ Not set
                    </span>
                  )}
                  {profileLoading && (
                    <span className="ml-auto text-gray-500 text-xs">Loading…</span>
                  )}
                </div>
                <div className="relative mb-5">
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    value={resolvedWallet || (profileLoading ? "Loading wallet..." : "No wallet address found")}
                    readOnly
                    className={`w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-sm border-2 focus:outline-none font-semibold cursor-not-allowed
                      ${!resolvedWallet && !profileLoading
                        ? "border-red-500/50 text-red-400/70"
                        : "border-gray-700 text-cyan-100"
                      }`}
                  />
                </div>

                {/* ── Package List ── */}
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-3">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Select Capital Package
                </div>

                {isLoading ? (
                  <p className="text-gray-500 text-xs text-center py-4">Loading packages…</p>
                ) : capitalPackages.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-4">No capital packages available.</p>
                ) : (
                  <div className="space-y-2 mb-5 max-h-52 overflow-y-auto pr-1">
                    {capitalPackages.map((item) => {
                      const available = parseFloat(item.tr09_real_amount - item.tr09_withdraw_amount).toFixed(2);
                      const isLocked = item.tr09_is_locked === 1;
                      const isSelected = fk.values.growth_option === `${item.tr07_trans_id}`;

                      return (
                        <label
                          key={item.tr07_trans_id}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200
                            ${isLocked
                              ? "border-gray-700/40 bg-gray-900/20 opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "border-cyan-400/60 bg-cyan-900/30 cursor-pointer"
                              : "border-gray-700 bg-gray-900/40 hover:border-cyan-400/30 hover:bg-cyan-900/10 cursor-pointer"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="growth_option"
                              value={item.tr07_trans_id}
                              disabled={isLocked}
                              onChange={() => {
                                if (isLocked) return;
                                fk.setFieldValue("growth_option", `${item.tr07_trans_id}`);
                                fk.setFieldValue("amount", parseFloat(available).toFixed(2));
                              }}
                              checked={isSelected}
                              className="accent-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                            <span className={`text-xs font-medium ${isLocked ? "text-gray-500" : "text-gray-400"}`}>
                              ID #{item.tr07_trans_id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isLocked && (
                              <span className="text-[10px] text-red-400/80 font-medium border border-red-400/30 px-1.5 py-0.5 rounded">
                                Locked
                              </span>
                            )}
                            <span className={`text-sm font-bold ${isSelected ? "text-cyan-400" : isLocked ? "text-gray-500" : "text-gray-300"}`}>
                              ${available}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* ── Amount Input ── */}
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Withdrawal Amount
                  {maxAmount > 0 && (
                    <span className="ml-auto text-cyan-400/70 text-xs">
                      Max: ${parseFloat(maxAmount).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="relative group mb-3">
                  <input
                    placeholder="0.00"
                    id="amount"
                    name="amount"
                    value={fk.values.amount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (e.target.value === "" || val <= maxAmount) {
                        fk.handleChange(e);
                      } else {
                        fk.setFieldValue("amount", maxAmount.toFixed(2));
                      }
                    }}
                    type="number"
                    min="0"
                    max={maxAmount}
                    disabled={!fk.values.growth_option}
                    className="w-full px-4 py-2 pr-16 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
                    USDT
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, "Max"].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!fk.values.growth_option}
                      onClick={() => {
                        if (!fk.values.growth_option) return;
                        if (amt === "Max") {
                          fk.setFieldValue("amount", maxAmount.toFixed(2));
                        } else {
                          fk.setFieldValue("amount", Math.min(amt, maxAmount).toFixed(2));
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-cyan-900/20 border border-cyan-400/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/40 hover:border-cyan-400/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {amt === "Max" ? "Max" : `$${amt}`}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* ── Warning Notice ── */}
            <div className="mb-6 flex items-start gap-3 bg-amber-950/30 border border-amber-400/30 rounded-lg p-4">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-amber-300 text-xs font-semibold mb-1">Important Notice</p>
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  Capital withdrawals are processed automatically. Locked packages cannot be withdrawn. Minimum withdrawal is $1.
                </p>
              </div>
            </div>

            {/* ── Submit Button ── */}
            <button
              onClick={handleWithdraw}
              type="button"
              disabled={profileLoading || !resolvedWallet}
              className="relative w-full py-4 rounded-xl font-bold text-base overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Request Capital Withdrawal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </div>
            </button>

            {/* SSL note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secured with SSL encryption</span>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0   { background-position: 0% 0%; }
        .bg-pos-100 { background-position: 100% 0%; }
      `}</style>
    </>
  );
}

export default CapitalWithdraw;