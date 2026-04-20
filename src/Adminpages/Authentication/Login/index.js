import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { endpoint } from "../../../utils/APIRoutes";
import axios from "axios";
import Loader from "../../../Shared/Loader";
import logo from "../../../assets/logo.png";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";

const LogIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // 2FA state
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [pendingAuth, setPendingAuth] = useState(null);
  const [otp, setOtp] = useState("");

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    enableReinitialize: true,
    onSubmit: (values) => loginFn(values),
  });

  // ── Step 1: Validate credentials ──────────────────────────────────────────
  const loginFn = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        endpoint?.admin_login,
        { username: username.trim(), password: password.trim() },
        { headers: { "Content-Type": "application/json" } },
      );

      const { message, result } = response?.data || {};
      const userType = result?.[0]?.user_type;
      const token = result?.[0]?.token;

      if (message === "Login Successfully") {
        // Don't persist yet — wait for 2FA verification
        setPendingAuth({ token, userType });
        setStep(2);
        toast.success("Credentials verified. Enter your 2FA code.");
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error during login.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify Admin TOTP ─────────────────────────────────────────────
  const verifyOtp = async (otpValue) => {
    const code = otpValue ?? otp; // use passed value if available, else state
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        endpoint?.verify_admin_totp,
        { otp: code },
        { headers: { "Content-Type": "application/json" } },
      );

      const { message } = response?.data || {};
      if (message === "OTP verified successfully") {
        const { token, userType } = pendingAuth;
        localStorage.setItem("logindataen_admin", token);
        localStorage.setItem("token", token);
        localStorage.setItem("login_user", userType);
        localStorage.setItem("user_type", userType);
        localStorage.setItem("uid", userType.toUpperCase());
        localStorage.setItem("username", userType.toUpperCase());

        toast.success(`Welcome back! Logged in as ${userType}`);
        navigate("/admindashboard");
        window.location.reload();
      } else {
        toast.error(message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    // Pass val directly — avoids React state async lag
    if (val.length === 6) {
      verifyOtp(val);
    }
  };

  const inputStyle = {
    background: "rgba(34,211,238,0.04)",
    border: "1px solid rgba(34,211,238,0.15)",
  };
  const inputFocus = (e) => {
    e.target.style.borderColor = "rgba(34,211,238,0.45)";
    e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.08)";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "rgba(34,211,238,0.15)";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      <Loader isLoading={loading} />

      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          background:
            "linear-gradient(135deg,#060d14 0%,#0a1219 50%,#0d1821 100%)",
        }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md mx-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#080f18 0%,#0a1520 100%)",
              border: "1px solid rgba(34,211,238,0.2)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(34,211,238,0.05)",
            }}
          >
            <div className="h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-white/5">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl" />
                <img
                  src={logo}
                  alt="Logo"
                  className="relative w-20 h-20 object-contain rounded-2xl"
                />
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <MdAdminPanelSettings className="text-cyan-400 text-xl" />
                <h1 className="text-white font-bold text-lg tracking-wide">
                  Admin Panel
                </h1>
              </div>
              <p className="text-gray-500 text-xs">
                {step === 1
                  ? "Sign in to manage your platform"
                  : "Two-Factor Authentication"}
              </p>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[
                  { num: 1, label: "Credentials" },
                  { num: 2, label: "2FA Code" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300"
                        style={{
                          background:
                            step >= s.num
                              ? "linear-gradient(135deg,#06b6d4,#3b82f6)"
                              : "rgba(255,255,255,0.05)",
                          color: step >= s.num ? "white" : "#4b5563",
                          boxShadow:
                            step === s.num
                              ? "0 0 16px rgba(6,182,212,0.6)"
                              : "none",
                        }}
                      >
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span className="text-[9px] text-gray-600 tracking-wide">
                        {s.label}
                      </span>
                    </div>
                    {i < 1 && (
                      <div
                        className="w-12 h-0.5 mb-4 transition-all duration-500"
                        style={{
                          background:
                            step > s.num
                              ? "linear-gradient(90deg,#06b6d4,#3b82f6)"
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── STEP 1: Credentials ── */}
            {step === 1 && (
              <form
                onSubmit={formik.handleSubmit}
                className="px-8 py-7 space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Username / Email / Mobile
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      required
                      className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                      style={inputStyle}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPw ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                    boxShadow: "0 8px 24px rgba(6,182,212,0.3)",
                    color: "white",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Verifying…
                      </>
                    ) : (
                      <>
                        <FaShieldAlt size={13} /> Continue to 2FA
                      </>
                    )}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <FaUserShield className="text-gray-700 text-xs" />
                  <p className="text-[11px] text-gray-600 text-center">
                    Sub-admins can log in here. Access is limited to assigned
                    permissions.
                  </p>
                </div>
              </form>
            )}

            {/* ── STEP 2: 2FA OTP ── */}
            {step === 2 && (
              <div className="px-8 py-7 space-y-6">
                {/* Icon */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      boxShadow: "0 0 32px rgba(34,211,238,0.1)",
                    }}
                  >
                    <RiShieldKeyholeLine className="text-cyan-400 text-3xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-semibold">
                      Enter Authenticator Code
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Open Google Authenticator or Authy and enter the 6-digit
                      code for{" "}
                      <span className="text-cyan-500">Dexon Global Admin</span>
                    </p>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 text-center">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-4 rounded-xl text-2xl text-white placeholder-gray-700 outline-none transition-all duration-200 text-center font-mono tracking-[0.5em]"
                    style={{
                      background: "rgba(34,211,238,0.04)",
                      border: "1px solid rgba(34,211,238,0.15)",
                      letterSpacing: "0.5em",
                    }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <p className="text-[10px] text-gray-600 text-center mt-2">
                    Code auto-submits when all 6 digits are entered
                  </p>
                </div>

                {/* Verify Button */}
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="relative w-full py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                    boxShadow: "0 8px 24px rgba(6,182,212,0.3)",
                    color: "white",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Verifying OTP…
                      </>
                    ) : (
                      <>
                        <RiShieldKeyholeLine size={15} /> Verify & Sign In
                      </>
                    )}
                  </span>
                </button>

                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setPendingAuth(null);
                  }}
                  className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  ← Back to credentials
                </button>
              </div>
            )}

            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>

          <p className="text-center text-gray-700 text-[10px] mt-4 tracking-widest">
            VERSION 1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;