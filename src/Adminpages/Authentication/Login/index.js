import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { endpoint } from '../../../utils/APIRoutes';
import axios from 'axios';
import Loader from '../../../Shared/Loader';
import logo from "../../../assets/logo.png";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserShield } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

const LogIn = () => {
  const navigate  = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [showPw,  setShowPw]    = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    enableReinitialize: true,
    onSubmit: (values) => loginFn(values),
  });

  const loginFn = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        endpoint?.admin_login,
        { username: username.trim(), password: password.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      const { message, result } = response?.data || {};
      const userType = result?.[0]?.user_type;   // "Admin" | "SubAdmin"
      const token    = result?.[0]?.token;

      if (message === "Login Successfully") {
        // Persist auth data
        localStorage.setItem("logindataen_admin", token);
        localStorage.setItem("token",             token);   // used by APIConnector + Sidebar
        localStorage.setItem("login_user",        userType);
        localStorage.setItem("user_type",         userType); // used by getFilteredMenu / Sidebar
        localStorage.setItem("uid",               userType.toUpperCase());
        localStorage.setItem("username",          userType.toUpperCase());

        toast.success(`Welcome back! Logged in as ${userType}`);

        // Both Admin and SubAdmin land on the admin dashboard
        // Sidebar will automatically filter tabs based on user_type
        navigate("/admindashboard");
        window.location.reload();
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "linear-gradient(135deg,#060d14 0%,#0a1219 50%,#0d1821 100%)" }}
      >
        {/* Background effects */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md mx-4">
          {/* Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:  "linear-gradient(135deg,#080f18 0%,#0a1520 100%)",
              border:      "1px solid rgba(34,211,238,0.2)",
              boxShadow:   "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.05)",
            }}
          >
            {/* Top accent */}
            <div className="h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-white/5">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl" />
                <img src={logo} alt="Logo" className="relative w-20 h-20 object-contain rounded-2xl" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <MdAdminPanelSettings className="text-cyan-400 text-xl" />
                <h1 className="text-white font-bold text-lg tracking-wide">Admin Panel</h1>
              </div>
              <p className="text-gray-500 text-xs">Sign in to manage your platform</p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="px-8 py-7 space-y-5">

              {/* Username */}
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
                  style={{
                    background:   "rgba(34,211,238,0.04)",
                    border:       "1px solid rgba(34,211,238,0.15)",
                  }}
                  onFocus={(e)  => { e.target.style.borderColor = "rgba(34,211,238,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.08)"; }}
                  onBlur={(e)   => { e.target.style.borderColor = "rgba(34,211,238,0.15)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Password */}
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
                    style={{
                      background: "rgba(34,211,238,0.04)",
                      border:     "1px solid rgba(34,211,238,0.15)",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.08)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(34,211,238,0.15)"; e.target.style.boxShadow = "none"; }}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                  boxShadow:  "0 8px 24px rgba(6,182,212,0.3)",
                  color:      "white",
                }}
              >
                {/* Shine sweep */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                </div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
                  ) : (
                    <><FaShieldAlt size={13} /> Sign In</>
                  )}
                </span>
              </button>

              {/* SubAdmin hint */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <FaUserShield className="text-gray-700 text-xs" />
                <p className="text-[11px] text-gray-600 text-center">
                  Sub-admins can log in here. Access is limited to assigned permissions.
                </p>
              </div>
            </form>

            {/* Bottom accent */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>

          {/* Version */}
          <p className="text-center text-gray-700 text-[10px] mt-4 tracking-widest">
            VERSION 1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;