import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import {
  saveToken
} from "../redux/slices/counterSlice";
import Loader from "../Shared/Loader";
import { endpoint } from "../utils/APIRoutes";
const DappLogin = () => {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressArray, setwalletAddressArray] = useState([]);
  const [searchParams] = useSearchParams();
  const referral_id = searchParams.get("startapp") || null;

  // const params = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logindataen, uid } = useSelector((state) => state.aviator);
  const datatele = {
    id: referral_id,
  };

  useEffect(() => {
    requestAccount();
  }, []);

  async function requestAccount() {
    setLoading(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }], // Binance Smart Chain Mainnet
        });
        const userAccount = accounts[0];
        setWalletAddress(userAccount);
        setwalletAddressArray(accounts);
      } catch (error) {
        Swal.fire({
          text: "Error connecting..." + error,
          confirmButtonColor: "black",
        });
      }
    } else {
      Swal.fire({
        text: "Wallet not detected.",
        confirmButtonColor: "black",
      });
    }
    setLoading(false);
  }
  const loginFn = async () => {
    if (!walletAddress) {
      Swal.fire({
        text: "Please connect your wallet first.",
        icon: "warning",
        confirmButtonColor: "black",
      });
      return;
    }

    setLoading(true);
    const reqBodyy = {
      lgn_type: 2,
      wallet_address: String(walletAddress),
    };
    // const reqBodyy = {
    //   mobile: String("9876543210"),
    //   email: String("9876543210"),
    //   full_name: String(datatele?.username||"N/A"),
    //   referral_id: String("9876543210"),
    //   username: String("9876543210"),
    //   password: String("9876543210"),
    // };

    try {
      const response = await axios.post(endpoint?.member_dapp_log_reg, reqBodyy, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      // console.log(response?.data);
      // toast(response?.data?.message);
      setLoading(false);
      if (response?.data?.success) {
        // dispatch(saveUid(reqBodyy?.mobile));
        dispatch(saveToken(response?.data?.result?.[0]?.token));
        // dispatch(saveUsername(reqBodyy?.username));
        // dispatch(saveUserCP(response?.data?.result?.[0]?.isCP));
        localStorage.setItem("logindataen", response?.data?.result?.[0]?.token);
        // localStorage.setItem("uid", reqBodyy?.mobile);
        localStorage.setItem("user_type", response?.data?.result?.[0]?.user_type);
        // localStorage.setItem("isCP", response?.data?.result?.[0]?.isCP);

        Swal.fire({
          title: "🎉 Congratulations!",
          html: `
            <p style="font-size:14px; margin-bottom:8px;">${response?.data?.message}</p>
          `,
          icon: "success",
          confirmButtonColor: "black",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard");
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
      toast.error("Error during login.");
      // Swal.fire({
      //   text: "Error during login.",

      //   confirmButtonColor: "black",
      // });
      setLoading(false);
    }
  };
  return (
    <>
      <Loader isLoading={loading} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Enhanced animated background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Enhanced star/dot background */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(cyan_0.5px,transparent_0.5px)] [background-size:40px_40px] opacity-15"></div>

        {/* Enhanced floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-40 right-32 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-40 w-1 h-1 bg-cyan-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '3.5s' }}></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md mx-1">
          {/* Enhanced outer glow container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl opacity-25 blur-xl animate-pulse"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl opacity-30 blur-lg"></div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/40 rounded-3xl px-2 py-12 shadow-2xl shadow-cyan-400/25 overflow-hidden backdrop-blur-sm">

            {/* Enhanced decorative background effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/8 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/8 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl"></div>

            {/* Enhanced decorative corners */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/25 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/15 rounded-bl-3xl"></div>

            {/* Enhanced accent lines */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Enhanced Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  {/* Enhanced logo glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full blur-3xl animate-pulse group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                  {/* Logo container */}
                  <div className="relative   group-hover:border-cyan-400/60 transition-all duration-500 group-hover:scale-105">
                    <img
                      onClick={() => window.open("https://web.dexon.global", "_blank")}
                      src={logo} alt="logo" className="h-20 w-auto relative z-10 drop-shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Enhanced Heading */}
              <div className="text-center mb-10">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-3xl font-bold mb-3 tracking-wide">
                  Welcome Back
                </h2>
                <p className="text-gray-300 text-base">Sign in with your email and password to continue</p>

                {/* Enhanced decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400/60"></div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-400/60"></div>
                </div>
              </div>

              {/* Enhanced Info Box */}
              <div className="mb-8 flex items-start gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 backdrop-blur-sm border border-blue-400/40 rounded-xl p-5 hover:border-blue-400/60 transition-all duration-300">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-blue-200 font-semibold text-sm mb-1">Secure Connection</h4>
                  <p className="text-blue-300/80 text-xs leading-relaxed">
                    Connect your wallet and sign in securely to access your account.
                  </p>
                </div>
              </div>

              {/* Wallet Connect */}
              <button
                onClick={requestAccount}
                className="w-full mb-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all duration-300"
              >
                Connect Your Wallet
              </button>

              {walletAddress && (
                <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 break-all">
                  Wallet Address: {walletAddress}
                </div>
              )}

              {/* Enhanced Login Button */}
              <button
                onClick={loginFn}
                disabled={!walletAddress}
                className="relative w-full py-5 rounded-2xl font-bold text-lg overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-8"
              >
                {/* Enhanced button background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>

                {/* Enhanced button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl"></div>

                {/* Button content */}
                <span className="relative z-10 flex items-center justify-center gap-4 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Dashboard
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>

                {/* Enhanced shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-300%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                </div>
              </button>

              {/* Enhanced Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
                <span className="text-gray-400 text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-600/50">OR</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/40 to-transparent"></div>
              </div>

              {/* Enhanced Registration Link */}
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold cursor-pointer hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                  >
                    Create Account
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </p>
              </div>

              {/* Enhanced Security Badge */}
              <div className="flex items-center justify-center gap-3 text-gray-400 text-xs bg-slate-800/30 backdrop-blur-sm rounded-full px-4 py-3 border border-slate-600/30">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-medium">Secured with blockchain technology</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Custom styles */}
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      </div>
    </>
  );

};

export default DappLogin;
