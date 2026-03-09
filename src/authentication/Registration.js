import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/favicon3.png";
import Loader from "../Shared/Loader";
import { endpoint } from "../utils/APIRoutes";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  // const [invitationcode, setInvitationcode] = useState("");
  const [sponsername, setSponsername] = useState("");
  const [searchParams] = useSearchParams();
  const referral_id = searchParams.get("startapp") || null;

  // const params = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const loginFn = async (reqBody) => {
    setLoading(true);

    if (password !== confirmpassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    const reqBodyy = {
      mobile: String(mobile)?.toLocaleLowerCase(),
      email: String(email)?.toLocaleLowerCase(),
      full_name: `${firstname} ${lastname}`.trim() || "N/A",
      referral_id: String(referral_id),
      password: String(password),
    };

    try {
      const response = await axios.post(endpoint?.registration_api, reqBodyy, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      setLoading(false);

      if (response?.data?.success) {
        // dispatch(saveUid(reqBodyy?.mobile));
        // dispatch(saveToken(response?.data?.result?.[0]?.token));
        // dispatch(saveUsername(reqBodyy?.username));
        // dispatch(saveUserCP(response?.data?.result?.[0]?.isCP));
        // localStorage.setItem("logindataen", response?.data?.result?.[0]?.token);
        // localStorage.setItem("uid", reqBodyy?.mobile);
        // localStorage.setItem("username", reqBodyy?.username);
        // localStorage.setItem("isCP", response?.data?.result?.[0]?.isCP);

        Swal.fire({
          title: "🎉 Congratulations!",
          html: `
            <p style="font-size:14px; margin-bottom:8px;">${response?.data?.message}</p>
            <p style="font-size:12px; color:#555;">Your account has been successfully created. You can now login to your account.</p>

          `,
          icon: "success",
          confirmButtonColor: "black",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
            window.location.reload();
          }
        });
        // toast(response?.data?.message);
        // navigate("/dashboard");
        // window.location.reload();
      } else {
        Swal.fire({
          text: response?.data?.message,
          icon: "warning",
          confirmButtonColor: "black",
        });
        // toast(response?.data?.message);
      }
    } catch (error) {
      toast("Error during registration.");
      setLoading(false);
    }
  };


  const getSponserName = async () => {
    try {
      const response = await axios.post(
        endpoint?.get_spon_name,
        { customer_id: referral_id },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response?.data?.success) {
        // setSponsername(response?.data?.result?.[0]?.lgn_name);
        setSponsername("true");
      } else {
        setSponsername("Invalid Sponser");
      }
    } catch (error) {
      setSponsername("Error fetching sponser");
    }
  };

  useEffect(() => {
    if (referral_id) {
      getSponserName();
    }
  }, [referral_id]);

  return (
    <>
      <Loader isLoading={loading} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Enhanced animated background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.2),transparent_50%)]"></div>

        {/* Multiple floating orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Enhanced star field */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:50px_50px] opacity-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(cyan_0.5px,transparent_0.5px)] [background-size:80px_80px] opacity-20"></div>

        {/* Enhanced floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute bottom-40 right-32 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-violet-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '3s' }}></div>

        {/* Registration Card */}
        <div className="relative z-10 w-full max-w-md mx-1">
          {/* Enhanced outer glow with multiple layers */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400  via-purple-500 to-cyan-400 rounded-3xl opacity-30 blur-xl animate-pulse"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 rounded-3xl opacity-40 blur-lg"></div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-cyan-400/40 rounded-3xl px-3 py-12 shadow-2xl shadow-cyan-400/30 overflow-hidden">

            {/* Enhanced decorative background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-violet-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl"></div>

            {/* Enhanced decorative corners */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-gradient-to-bl from-cyan-400/30 to-purple-400/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-gradient-to-tr from-violet-400/20 to-cyan-400/20 rounded-bl-3xl"></div>

            {/* Enhanced accent lines */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400  via-violet-500 to-cyan-400 animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Enhanced Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  {/* Multi-layered logo glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-cyan-400/40 rounded-full blur-3xl animate-pulse group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-violet-400/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                  {/* Logo container */}
                  <div className="relative   group-hover:border-cyan-400/60 transition-all duration-500 group-hover:scale-105">
                    <img src={logo} alt="Hyperchainx" className="h-28 w-auto relative z-10 drop-shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Enhanced Heading */}
              <div className="text-center mb-10">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300  via-violet-400 to-cyan-400 text-3xl font-bold mb-3 tracking-wide">
                  Create Account
                </h2>
                <p className="text-slate-300 text-base font-medium">Welcome to the Forex Trading Platform with Advanced Features</p>

                {/* Enhanced decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-purple-400/60"></div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent via-purple-400/60 to-cyan-400/60"></div>
                </div>
              </div>

              {/* Enhanced Form Fields */}
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ID"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={referral_id}
                  // onChange={(e) => setInvitationcode(e.target.value)}
                  placeholder="Invitation Code"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={sponsername === "true" ? "Valid Referral" : sponsername}
                  // onChange={(e) => setSponsername(e.target.value)}
                  placeholder="Sponser Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Enhanced Sign Up Button */}
              <div className="mb-8">
                <button
                  onClick={loginFn}
                  disabled={!firstname || !lastname || !email || !mobile || !password || !confirmpassword || password !== confirmpassword}
                  className="relative w-full py-5 rounded-2xl font-bold text-lg overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Enhanced button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600  to-cyan-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-700 disabled:opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>

                  {/* Enhanced button glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-80 transition-opacity duration-500 blur-xl rounded-2xl"></div>

                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center gap-4 text-white">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>

                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-300%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                  </div>
                </button>

                {/* Validation hint */}
                {((!firstname || !lastname || !email || !mobile || !password || !confirmpassword) || (password !== confirmpassword)) && (
                  <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>
                      {password !== confirmpassword ? "Passwords do not match" : "Please fill all required fields"}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent  via-purple-400/40 to-transparent"></div>
                <span className="text-slate-400 text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-600/50">OR</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent  via-cyan-400/40 to-transparent"></div>
              </div>

              {/* Enhanced Login Link */}
              <div className="text-center mb-6">
                <p className="text-slate-300 text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/")}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400 font-bold cursor-pointer hover:from-cyan-300 hover:via-purple-300 hover:to-violet-300 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                  >
                    Sign In
                    <svg className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </p>
              </div>

              {/* Enhanced Security Badge */}
              <div className="flex items-center justify-center gap-3 text-slate-400 text-xs bg-slate-800/30 backdrop-blur-sm rounded-full px-4 py-3 border border-slate-600/30">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-medium">Secured registration process</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Custom Animations */}
        <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      </div>
    </>
  );

};

export default Registration;
