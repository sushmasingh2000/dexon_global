import { ethers } from "ethers";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { enCryptData } from "../../../utils/Secret";
const tokenABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function deposit(uint256 usdtAmount, uint256 fstAmount) external",
  "function burnToken(address token, address user, uint256 amount) external",
  "function checkAllowance(address token, address user) external view returns (uint256)",
  "event Deposited(address indexed user, uint256 usdtAmount, uint256 fstAmount)",
  "event TokenBurned(address indexed user, uint256 amount)",
  "function decimals() view returns (uint8)",
];
const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
function TopupUpWithoutPull() {
  const [walletAddress, setWalletAddress] = useState("");
  const [no_of_Tokne, setno_of_Tokne] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [receiptStatus, setReceiptStatus] = useState("");
  const [bnb, setBnb] = useState("");

  const [loding, setLoding] = useState(false);
  const fk = useFormik({
    initialValues: {
      inr_value: "",
    },
  });
  async function requestAccount() {
    setLoding(true);

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
        setWalletAddress(userAccount);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const nativeBalance = await provider.getBalance(userAccount);
        setBnb(ethers.utils.formatEther(nativeBalance));
        const tokenContract = new ethers.Contract(
          "0x55d398326f99059fF775485246999027B3197955",
          tokenABI,
          provider,
        );
        const tokenBalance = await tokenContract.balanceOf(userAccount);
        setno_of_Tokne(ethers.utils.formatUnits(tokenBalance, 18));
      } catch (error) {
        console.log(error);
        toast("Error connecting...", error);
      }
    } else {
      toast("Wallet not detected.");
    }
    setLoding(false);
  }

  async function sendTokenTransaction() {
    if (!window.ethereum) return toast("MetaMask not detected");
    if (!walletAddress) return toast("Please connect your wallet.");

    const usdAmount = Number(fk.values.inr_value || 0);
    if (usdAmount % 1 !== 0) {
      Swal.fire({
        text: "Please Enter an amount in multiples of $1.",

        confirmButtonColor: "black",
      });
      return;
    }
    if (usdAmount < 1) {
      Swal.fire({
        text: "Please Enter an amount above or equal to $1.",
        confirmButtonColor: "black",
      });
      return;
    }

    try {
      setLoding(true);

      // ✅ Switch to BSC Mainnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const usdtContract = new ethers.Contract(
        "0x55d398326f99059fF775485246999027B3197955",
        USDT_ABI,
        signer,
      );
      const decimals = await usdtContract.decimals(); // 18
      const usdtAmount = ethers.utils.parseUnits(
        usdAmount.toString(),
        decimals,
      );
      // 🔍 Balance Check
      const balance = await usdtContract.balanceOf(userAddress);
      if (balance.lt(usdtAmount)) {
        setLoding(false);
        Swal.fire({
          text: "Insufficient USDT balance",
          confirmButtonColor: "black",
        });
        return;
      }
      const dummyData = await PayinZpDummy(0);
      if (!dummyData?.success || !dummyData?.result?.[0]?.last_id) {
        setLoding(false);
        Swal.fire({
          text: dummyData?.message || "Server error",

          confirmButtonColor: "black",
        });
        return;
      }
      const last_id = Number(dummyData?.result?.[0]?.last_id);
      const tx = await usdtContract.transfer(
        "0xa63941eE9eED3280b21965A91C3ee236bF7095Ea",
        usdtAmount,
      );

      const receipt = await tx.wait();

      setTransactionHash(tx.hash);
      setReceiptStatus(receipt.status === 1 ? "Success" : "Failure");

      await PayinZp(0, tx.hash, receipt.status === 1 ? 2 : 3, last_id);

      if (receipt.status === 1) {
        Swal.fire({
          title: "Congratulations!",
          text: "🎉 Your payment has been initiated successfully, and your account has been topped up.",
          icon: "success",
          confirmButtonColor: "black",
        });
      } else {
        toast("Transaction failed!");
      }
    } catch (error) {
      console.error(error);
      if (error?.data?.message) toast(error.data.message);
      else if (error?.reason) toast(error.reason);
      else toast("BNB transaction failed.");
    } finally {
      setLoding(false);
    }
  }

  async function PayinZp(bnbPrice, tr_hash, status, id) {
    setLoding(true);

    const reqbody = {
      req_amount: fk.values.inr_value,
      u_user_wallet_address: walletAddress,
      u_transaction_hash: tr_hash,
      u_trans_status: status,
      currentBNB: 0,
      currentZP: no_of_Tokne,
      gas_price: bnbPrice,
      pkg_id: "1",
      last_id: id,
    };
    try {
      await apiConnectorPost(
        endpoint?.paying_api,
        {
          payload: enCryptData(reqbody),
        },
        // base64String
      );
      // toast(res?.data?.message);
      fk.handleReset();
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  async function PayinZpDummy(bnbPrice) {
    const reqbody = {
      req_amount: fk.values.inr_value,
      u_user_wallet_address: walletAddress,
      u_transaction_hash: "xxxxxxxxxx",
      u_trans_status: 1,
      currentBNB: 0,
      currentZP: no_of_Tokne,
      gas_price: bnbPrice,
      pkg_id: "1",
      deposit_type: "Mlm",
    };

    try {
      const res = await apiConnectorPost(
        endpoint?.paying_dummy_api,
        {
          payload: enCryptData(reqbody),
        },
        // base64String
      );
      return res?.data || {};
    } catch (e) {
      console.log(e);
      console.log(e);
    }
  }


  return (
    <>
      <Loader isLoading={loding} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center  py-8">
        <div className="w-full max-w-md bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/30 rounded-2xl p-8 shadow-2xl shadow-cyan-400/20 relative overflow-hidden">

          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/10 rounded-bl-2xl"></div>

          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"></div>

          {/* Content Container */}
          <div className="relative z-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-2xl font-bold">
                    Deposit Funds
                  </h2>
                </div>
                <p className="text-gray-400 text-xs">Add funds to your account</p>
              </div>

              {/* Connect Button */}
              <button
                onClick={requestAccount}
                className="relative px-4 py-2 rounded-lg font-semibold text-sm overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <span className="relative z-10 text-white flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect
                </span>
              </button>
            </div>

            {/* Wallet Address */}
            {walletAddress && (
              <div className="mb-6 bg-gradient-to-r from-yellow-950/30 to-amber-900/20 rounded-lg p-3 border border-yellow-400/20">
                <p className="text-yellow-400 text-xs break-all font-mono">
                  {walletAddress}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>

            {/* Current Slab */}
            {/* <div className="mb-4">
              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Current Slab
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`Slab ${user_profile?.actual_slot} ($${Number(
                    user_profile?.desired_buss || 0,
                  )?.toFixed(0)}) - ${roman[Math.ceil(Number(user_profile?.slab_no || 0)) - 1]}`}
                  disabled
                  className="w-full px-1 py-3 rounded-lg bg-gradient-to-r from-cyan-950/40 to-blue-900/30 text-cyan-300 text-sm border border-cyan-400/20 font-semibold"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
              </div>
            </div> */}

            {/* Remaining Amount */}
            {/* <div className="mb-4">
              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Remaining Amount For Slab
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`$${(
                    Number(user_profile?.remaining_amount || 0)
                  ).toFixed(2)}`}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-950/40 to-amber-900/30 text-yellow-300 text-sm border border-yellow-400/20 font-semibold"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                </div>
              </div>
            </div> */}

            {/* Wallet Balance */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Wallet Balance
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${Number(no_of_Tokne || 0).toFixed(2)} USDT`}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-950/40 to-emerald-900/30 text-green-300 text-sm border border-green-400/20 font-semibold"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
              <span className="text-gray-500 text-xs font-medium">ENTER AMOUNT</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>

            {/* Enter Amount */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Amount to Top Up
              </label>
              <div className="relative group">
                <input
                  placeholder="0.00"
                  id="inr_value"
                  name="inr_value"
                  value={fk.values.inr_value}
                  onChange={fk.handleChange}
                  className="relative z-10 w-full px-4 py-4 rounded-lg 
    bg-gradient-to-r from-blue-950/40 to-indigo-900/30 
    text-white text-lg border-2 border-blue-400/30 
    focus:border-blue-400 focus:outline-none 
    transition-all duration-300 font-semibold 
    placeholder:text-gray-500"
                />

                {/* USDT label */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                  USDT
                </div>

                {/* ✅ Glow Fix */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 
  rounded-lg opacity-0 group-focus-within:opacity-20 blur 
  transition-opacity duration-300 pointer-events-none"></div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              onClick={sendTokenTransaction}
              className="relative w-full py-4 rounded-lg font-bold text-base overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Button background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>

              {/* Button glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Transaction
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </div>
            </button>

            {/* Security Note */}
            <div className="mt-4 flex items-start gap-2 bg-blue-950/20 border border-blue-400/20 rounded-lg p-3">
              <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-blue-300 text-xs leading-relaxed">
                Your transaction is secured with blockchain technology. Please ensure your wallet has sufficient funds.
              </p>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-32 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-20 w-1 h-1 bg-cyan-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <style>{`
      .bg-size-200 {
        background-size: 200% 100%;
      }
      .bg-pos-0 {
        background-position: 0% 0%;
      }
      .bg-pos-100 {
        background-position: 100% 0%;
      }
    `}</style>
    </>
  );
}
export default TopupUpWithoutPull;
