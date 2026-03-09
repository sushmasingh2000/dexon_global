import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn } from "../../../utils/utilityFun";
import { useNavigate } from "react-router-dom";

function TopupWithContWithoutPull() {

  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loding, setLoding] = useState(false);
  const fk = useFormik({
    initialValues: {
      inr_value: "",
    },
  });
  async function generateDepositQrCode() {
    setLoding(true);
    try {
      if (!fk.values.inr_value || Number(fk.values.inr_value || 0) <= 0) {
        Swal.fire({
          text: "Please enter amount first",
          confirmButtonColor: "black",
        });
        setLoding(false);
        return;
      }
      const qrCode = await apiConnectorPost(endpoint?.get_topup_qr, {
        pkg_amount: fk.values.inr_value,
      });

      console.log("QR Code API Response:", qrCode);
      if (qrCode?.data?.success) {
        setQrCode(qrCode?.data?.result?.[0]);
      } else {
        toast("Failed to fetch QR code.");
      }
    } catch (error) {
      console.log(error);
      toast("Error connecting...", error);
    }
    setLoding(false);
  }

  async function sendTokenTransaction() {

    setLoding(true);
    try {

      const apiRes = await apiConnectorGet(
        endpoint?.member_self_topup
      );

      if (apiRes?.data?.success) {
        Swal.fire({
          icon: "success",
          text: apiRes?.data?.msg,
          confirmButtonColor: "black",
        });
        navigate("/activation");
      } else {
        Swal.fire({
          icon: "warning",
          text: apiRes?.data?.msg || "Topup failed. Please try again.",
          confirmButtonColor: "black",
        });
      }
    } catch (error) {
      toast("Error connecting...", error);
    }
    setLoding(false);
  }






  const { data: profile_data, isLoading: profileloading } = useQuery(
    ["profile_api"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
  const user_profile = profile_data?.data?.result?.[0] || [];



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
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-2xl font-bold">
                  Deposit To Fund Wallet
                </h2>
              </div>
              <p className="text-gray-400 text-xs">Add funds to your fund wallet</p>
            </div>



            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
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
                  className="relative z-10 w-full px-4 py-4 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-lg border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold placeholder:text-gray-400"
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

            {/* Generate QR Button */}
            <button
              onClick={() => areYouSureFn(Swal, generateDepositQrCode)}
              className="relative w-full py-4 mb-4 rounded-lg font-bold text-base overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 18h4.01M12 9h4.01M12 6h4.01M6 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Generate Qr Code
              </span>
            </button>

            {/* QR Display */}
            {qrCode && (
              <div className="mb-6 flex flex-col items-center justify-center">
                <img src={qrCode?.qr} alt="QR Code" className="w-32 h-32" />
                <div className="ml-4 mt-4 flex items-center gap-2">
                  <p className="text-cyan-200 text-xs font-mono break-all">{qrCode?.address}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrCode?.address || "");
                      toast("Address copied!");
                    }}
                    className="px-2 py-1 text-xs rounded bg-cyan-700 hover:bg-cyan-600 text-white font-semibold transition-all duration-200 focus:outline-none"
                    title="Copy address"
                  >
                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 2a2 2 0 012 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>
            )}

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


          </div>


        </div>
      </div>

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
    `}</style>
    </>
  );
}
export default TopupWithContWithoutPull;
