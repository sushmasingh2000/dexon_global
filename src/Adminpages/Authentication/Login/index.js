import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { endpoint } from "../../../utils/APIRoutes";
import axios from "axios";
import Loader from "../../../Shared/Loader";
import logo from "../../../assets/logo.png";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineMarkEmailRead } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";

const LogIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Multi-factor state
  const [step, setStep] = useState(1); // 1 = credentials, 2 = mail OTP, 3 = authenticator OTP
  const [pendingAuth, setPendingAuth] = useState(null);
  const [mailOtp, setMailOtp] = useState("");
  const [otp, setOtp] = useState("");

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    enableReinitialize: true,
    onSubmit: (values) => loginFn(values),
  });

  const resetToCredentials = () => {
    setStep(1);
    setPendingAuth(null);
    setMailOtp("");
    setOtp("");
  };

  // ── Step 1: Validate credentials → send mail OTP ──────────────────────────
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
      const useremail = username.trim();

      if (message === "Login Successfully") {
        // Don't persist yet — wait for mail OTP + 2FA verification
        setPendingAuth({ token, userType, useremail });
        await sendMailOtp(useremail);
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error during login.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2a: Send mail OTP ─────────────────────────────────────────────────
  const sendMailOtp = async (useremail) => {
    try {
      const response = await axios.post(
        endpoint?.send_otp,
        { useremail },
        { headers: { "Content-Type": "application/json" } },
      );
      if (response?.data?.success) {
        setStep(2);
        toast.success("OTP sent to your registered email.");
      } else {
        toast.error(response?.data?.msg || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Error sending OTP.");
    }
  };

  // ── Step 2b: Verify mail OTP → move to authenticator step ─────────────────
  const verifyMailOtp = async (otpValue) => {
    const code = otpValue ?? mailOtp;
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        endpoint?.verify_otp,
        { useremail: pendingAuth?.useremail, otp: code },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response?.data?.success) {
        setOtp("");
        setStep(3);
        toast.success("Email verified. Enter your authenticator code.");
      } else {
        toast.error(response?.data?.msg || "Invalid OTP.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleMailOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setMailOtp(val);
    if (val.length === 6) {
      verifyMailOtp(val);
    }
  };

  // ── Step 3: Verify Admin TOTP ──────────────────────────────────────────────
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
                  : step === 2
                    ? "Email Verification"
                    : "Two-Factor Authentication"}
              </p>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[
                  { num: 1, label: "Credentials" },
                  { num: 2, label: "Email OTP" },
                  { num: 3, label: "Authenticator" },
                ].map((s, i, arr) => (
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
                    {i < arr.length - 1 && (
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

            {/* ── STEP 2: Email OTP ── */}
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
                    <MdOutlineMarkEmailRead className="text-cyan-400 text-3xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-semibold">
                      Enter Email OTP
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Enter the 6-digit code sent to{" "}
                      <span className="text-cyan-500">
                        {pendingAuth?.useremail}
                      </span>
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
                    value={mailOtp}
                    onChange={handleMailOtpChange}
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
                  onClick={() => verifyMailOtp()}
                  disabled={loading || mailOtp.length !== 6}
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
                        <MdOutlineMarkEmailRead size={15} /> Verify & Continue
                      </>
                    )}
                  </span>
                </button>

                {/* Back button */}
                <button
                  type="button"
                  onClick={resetToCredentials}
                  className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  ← Back to credentials
                </button>
              </div>
            )}

            {/* ── STEP 3: Authenticator OTP ── */}
            {step === 3 && (
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
                  onClick={() => verifyOtp()}
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
                  onClick={resetToCredentials}
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
