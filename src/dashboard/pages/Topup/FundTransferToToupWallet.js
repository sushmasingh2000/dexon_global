import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn } from "../../../utils/utilityFun";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FundTransferToToupWallet() {
  const client = useQueryClient();
  const [sponsername, setSponsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loding, setLoding] = useState(false);
  const fk = useFormik({
    initialValues: {
      transfer_amount: "",
      customer_id: "",
      wallet_type: "fund",
      topup_plan: "dglite",
    },
  });

  async function sendTokenTransaction() {
    const transferAmount = Number(fk.values.transfer_amount || 0);

    if (!fk.values.transfer_amount || transferAmount <= 0) {
      Swal.fire({ text: "Please enter a valid transfer amount", confirmButtonColor: "black", icon: "warning" });
      return;
    }
    if (!fk.values.customer_id || String(fk.values.customer_id).trim() === "") {
      Swal.fire({ text: "Please enter Customer Id", confirmButtonColor: "black", icon: "warning" });
      return;
    }
    if (fk.values.wallet_type === "topup") {
      if (fk.values.topup_plan === "dglite" && (transferAmount < 10 || transferAmount > 499)) {
        Swal.fire({ text: "For DGLite, amount should be between 10 and 499", confirmButtonColor: "black", icon: "warning" });
        return;
      }

      if (fk.values.topup_plan === "dgpro" && transferAmount < 500) {
        Swal.fire({ text: "For DGPro, amount should be 500 or above", confirmButtonColor: "black", icon: "warning" });
        return;
      }
    }

    if (Number(user_profile?.tr03_fund_wallet || 0) < transferAmount) {
      Swal.fire({ text: "Insufficient fund in your wallet", confirmButtonColor: "black", icon: "warning" });
      return;
    }

    setLoding(true);
    try {
      const payload = {
        pkg_amount: fk.values.transfer_amount,
        pkg_id: 1,
        to_cust_id: fk.values.customer_id,
        wallet_type: fk.values.wallet_type === 'fund' ? "fund_wallet" : "topup_wallet",
        // note: `Transfer to ${fk.values.wallet_type === 'fund' ? 'Fund Wallet' : 'Topup Wallet'}`,
      };

      const res = await apiConnectorPost(endpoint?.member_fund_transfer, payload);
      if (res?.data?.success) {

        Swal.fire({ icon: "success", text: res?.data?.message || "Transfer submitted", confirmButtonColor: "black" });
        fk.handleReset();
        client.invalidateQueries("profile_api");
        client.invalidateQueries("get_actiavtion");
        navigate("/fund-transfer-history");

      } else {
        Swal.fire({ icon: "warning", text: res?.data?.message || "Transfer failed", confirmButtonColor: "black" });
      }
    } catch (error) {
      console.error(error);
      toast("Error connecting...");
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


  const getSponserName = async () => {
    try {
      const response = await axios.post(
        endpoint?.get_spon_name,
        { customer_id: fk.values.customer_id },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response?.data?.success) {
        setSponsername(response?.data?.result?.[0]?.lgn_name);
      } else {
        setSponsername("Invalid Sponser");
      }
    } catch (error) {
      setSponsername("Error fetching sponser");
    }
  };

  useEffect(() => {
    if (fk.values.customer_id) {
      getSponserName();
    }
  }, [fk.values.customer_id]);



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
                  Topup Account
                </h2>
              </div>
              <p className="text-gray-400 text-xs">Topup your account with funds</p>
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

            {/* Transfer Form */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Your Current Fund Wallet Balance
              </label>
              <div className="relative mb-4">
                <input
                  readOnly
                  value={`$${user_profile?.tr03_fund_wallet || 0}`}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-200 text-sm border border-gray-700 font-semibold focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Wallet Type Radio */}
              <div className="mb-4 flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    name="wallet_type"
                    value="fund"
                    onChange={(e) => {
                      fk.handleChange(e);
                    }}
                    checked={fk.values.wallet_type === "fund"}
                    className="form-radio text-cyan-400"
                  />
                  Fund Wallet
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    name="wallet_type"
                    value="topup"
                    onChange={(e) => {
                      fk.handleChange(e);
                      fk.setFieldValue("topup_plan", "dglite");
                    }}
                    checked={fk.values.wallet_type === "topup"}
                    className="form-radio text-cyan-400"
                  />
                  Topup Wallet
                </label>
              </div>

              {fk.values.wallet_type === "topup" && (
                <div className="mb-4 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="topup_plan"
                      value="dglite"
                      onChange={fk.handleChange}
                      checked={fk.values.topup_plan === "dglite"}
                      className="form-radio text-cyan-400"
                    />
                    DGLite (10-499) USD
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="topup_plan"
                      value="dgpro"
                      onChange={fk.handleChange}
                      checked={fk.values.topup_plan === "dgpro"}
                      className="form-radio text-cyan-400"
                    />
                    DGPro (500 or above) USD
                  </label>
                </div>
              )}

              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">Enter Transfer Amount</label>
              <input
                placeholder="0.00"
                id="transfer_amount"
                name="transfer_amount"
                value={fk.values.transfer_amount}
                onChange={fk.handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-lg border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold mb-4"
              />

              <label className="flex items-center gap-2 text-gray-300 text-sm mb-2 font-medium">Enter Customer Id</label>
              <div className="flex flex-col mb-2">
                <input
                  placeholder="Customer Id"
                  id="customer_id"
                  name="customer_id"
                  value={fk.values.customer_id}
                  onChange={fk.handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-lg border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold "
                />
                <span className="!text-rose-500 !text-[10px] pl-2">{sponsername}</span>
              </div>


              <button
                onClick={() => {
                  areYouSureFn(Swal, sendTokenTransaction, {})
                }}
                className="relative w-full py-4 rounded-lg font-bold text-base overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-white">Submit</span>
              </button>
            </div>

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
export default FundTransferToToupWallet;
