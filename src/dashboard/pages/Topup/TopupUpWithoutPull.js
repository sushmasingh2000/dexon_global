import { Box } from "@mui/material";
import { ethers } from "ethers";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { depositAddress, endpoint } from "../../../utils/APIRoutes";
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
          provider
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
    if (!window.ethereum) {
      toast("MetaMask / Wallet not detected");
      return;
    }
    if (!walletAddress) {
      toast("Please connect your wallet.");
      return;
    }
    const usdAmount = Number(fk.values.inr_value || 0);
    if (isNaN(usdAmount) || usdAmount < 5) {
      toast("Please enter an amount above or equal to $5.");
      return;
    }

    try {
      setLoding(true);

      // Ensure chain is BSC mainnet (56 / 0x38). Try switch; if user doesn't have it, attempt add (silent failure handled)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      } catch (switchError) {
        // If user rejects or chain not added, inform silently via toast
        // Do not show blocking modal; user needs to manually switch/add in wallet if needed
        console.warn("chain switch failed:", switchError);
        toast("Please ensure your wallet is on BSC Mainnet (ChainId 56).");
        setLoding(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Get BNB price
      async function getBNBPriceInUSDT() {
        try {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
          );
          const data = await response.json();
          if (data?.binancecoin?.usd) return data.binancecoin.usd;
        } catch (e) {
          console.warn("coingecko failed", e);
        }
        try {
          const response = await fetch(
            "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
          );
          const data = await response.json();
          return parseFloat(data.price);
        } catch (e) {
          console.warn("binance fallback failed", e);
          throw new Error("Unable to fetch BNB price");
        }
      }

      const bnbPrice = await getBNBPriceInUSDT();
      const bnbAmount = usdAmount / bnbPrice; // floating

      // helper to convert to wei safely (use high precision string)
      function toWeiString(amountFloat) {
        // keep 18 decimals then trim trailing zeros
        const fixed = Number(amountFloat).toFixed(18);
        return fixed.replace(/\.?0+$/, "");
      }
      const bnbValue = ethers.utils.parseEther(toWeiString(bnbAmount));

      // Check depositAddress is EOA (not contract)
      const code = await provider.getCode(depositAddress);
      if (code && code !== "0x") {
        // It's a contract — sending plain transfer may behave differently
        toast("Deposit address appears to be a contract. Contact support.");
        setLoding(false);
        return;
      }

      // Balance check
      const bnbBalance = await provider.getBalance(userAddress);
      if (bnbBalance.lt(bnbValue)) {
        toast("Insufficient BNB balance for this payment.");
        setLoding(false);
        return;
      }

      // Estimate gas with fallback to 21000
      let gasLimit;
      try {
        const estimated = await signer.estimateGas({
          to: depositAddress,
          value: bnbValue,
        });
        // add small buffer
        gasLimit = estimated.add(ethers.BigNumber.from("10000"));
        // but don't go under 21000
        if (gasLimit.lt(ethers.BigNumber.from("21000"))) {
          gasLimit = ethers.BigNumber.from("21000");
        }
      } catch (e) {
        console.warn("estimateGas failed, using 21000 fallback", e);
        gasLimit = ethers.BigNumber.from("21000");
      }

      const gasPrice = await provider.getGasPrice();
      const gasCost = gasLimit.mul(gasPrice);

      if (bnbBalance.lt(gasCost.add(bnbValue))) {
        const need = ethers.utils.formatEther(
          gasCost.add(bnbValue).sub(bnbBalance)
        );
        toast(`Not enough BNB for gas+value. Need approx ${need} BNB more.`);
        setLoding(false);
        return;
      }

      // Create transaction object — no Swal modal, just toast updates.
      const txRequest = {
        to: depositAddress,
        value: bnbValue,
        gasLimit: gasLimit, // ethers will accept BigNumber
        // gasPrice: gasPrice // usually provider takes care; uncomment if you want to set explicitly
      };

      // Send transaction — wallet will show confirmation (cannot be suppressed).
      let tx;
      try {
        tx = await signer.sendTransaction(txRequest);
      } catch (sendErr) {
        // Common user-friendly handling
        console.error("sendTransaction error:", sendErr);
        if (sendErr.code === 4001) {
          // user rejected
          toast("Transaction rejected by user");
        } else if (sendErr?.reason) {
          toast(sendErr.reason);
        } else if (sendErr?.data?.message) {
          toast(sendErr.data.message);
        } else {
          toast("BNB transaction failed to send.");
        }
        setLoding(false);
        return;
      }

      // Optional: inform user a tx was submitted
      toast("Transaction submitted, waiting for confirmation...");

      const receipt = await tx.wait();

      setTransactionHash(tx.hash);
      setReceiptStatus(receipt.status === 1 ? "Success" : "Failure");

      // call server API
      const dummyData = await PayinZpDummy(bnbPrice);
      const last_id =
        dummyData?.success && dummyData.last_id
          ? Number(dummyData.last_id)
          : null;
      await PayinZp(bnbPrice, tx.hash, receipt.status === 1 ? 2 : 3, last_id);

      if (receipt.status === 1) {
        toast("Payment successful!");
      } else {
        toast("Transaction failed.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // minimal user noise
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
        }
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
        }
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

      <div className="py-10 bg-gray-900 flex items-center justify-center p-4">
        <Box className="w-full max-w-md bg-white p-5 rounded-xl shadow-lg ">
          <button
            className="w-full bg-gold-color text-black font-semibold py-2 rounded mb-4 hover:bg-white transition"
            onClick={requestAccount}
          >
            Connect With DApp
          </button>

          {/* Wallet Info */}
          <div className="bg-gray-700 p-4 rounded-lg text-sm text-white mb-4">
            <div className="mb-2">
              <p className="font-semibold text-gold-color text-center pb-1">
                Associated Wallet
              </p>

              <p className="break-all text-center">
                {walletAddress?.substring(0, 10)}...
                {walletAddress?.substring(walletAddress?.length - 10)}
              </p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <input
              placeholder="Enter TopUp Amount"
              id="inr_value"
              name="inr_value"
              value={fk.values.inr_value}
              onChange={fk.handleChange}
              className="w-full p-2 text-sm rounded-md bg-gray-700 text-white  focus:ring focus:ring-yellow-300 outline-none"
            />
          </div>

          {/* Confirm Button */}
          <button
            className="w-full bg-gold-color text-black font-semibold py-2 rounded-full hover:bg-white transition"
            onClick={sendTokenTransaction}
          >
            Pay Now
          </button>

          {/* Transaction Info */}
          {transactionHash && (
            <div className="bg-gray-700 p-4 mt-4 rounded-lg text-xs text-white ">
              <div className="mb-2">
                <p className="font-semibold text-gold-color">
                  Transaction Hash:
                </p>
                <p className="break-words">{transactionHash}</p>
              </div>
              {/* <div className="mb-2 flex justify-between">
              <p className="text-gold-color">Gas Price:</p>
              <p className="font-semibold">{gasprice}</p>
            </div> */}
              <div className="flex justify-between">
                <p className="text-gold-color">Transaction Status:</p>
                <p className="font-semibold">{receiptStatus}</p>
              </div>
            </div>
          )}
        </Box>
      </div>
    </>
  );
}
export default TopupUpWithoutPull;
