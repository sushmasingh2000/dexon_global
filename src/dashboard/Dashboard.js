import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BarChartIcon from '@mui/icons-material/BarChart';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import InsightsIcon from '@mui/icons-material/Insights';
import PaidIcon from "@mui/icons-material/Paid";
import PieChartIcon from '@mui/icons-material/PieChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Loader from "../Shared/Loader";
import { apiConnectorGet } from "../utils/APIConnector";
import { endpoint, frontend } from "../utils/APIRoutes";
import { getFloatingValue } from "../utils/utilityFun";
import tether from "../images/tether.png";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
const Card = ({ title, value, color, icon = "dollar", path, navigate }) => {
  const colors = {
    cyan: {
      gradient: "from-[#0a1219] via-[#0d1519] to-[#0f1b21]",
      border: "border-cyan-400/30",
      accent: "from-cyan-400 via-cyan-500 to-transparent",
      text: "from-cyan-300 via-cyan-400 to-cyan-500",
      glow: "bg-cyan-400/5 group-hover:bg-cyan-400/10",
      glowSmall: "bg-cyan-500/5",
      shadow: "shadow-cyan-400/10 hover:shadow-cyan-400/20",
      progressBar: "from-cyan-500 to-cyan-400",
      progressShadow: "shadow-cyan-400/50",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      iconBorder: "border-cyan-400/30",
      iconGlow: "bg-cyan-400/20",
      pulseColor: "bg-cyan-400",
      orbiting: "bg-cyan-400",
    },
    yellow: {
      gradient: "from-[#1a1406] via-[#0d1519] to-[#1a0f06]",
      border: "border-yellow-400/30",
      accent: "from-yellow-400 via-amber-500 to-transparent",
      text: "from-yellow-300 via-yellow-400 to-amber-500",
      glow: "bg-yellow-400/5 group-hover:bg-yellow-400/10",
      glowSmall: "bg-amber-500/5",
      shadow: "shadow-yellow-400/10 hover:shadow-yellow-400/20",
      progressBar: "from-yellow-500 to-yellow-400",
      progressShadow: "shadow-yellow-400/50",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-400/10",
      iconBorder: "border-yellow-400/30",
      iconGlow: "bg-yellow-400/20",
      pulseColor: "bg-yellow-400",
      orbiting: "bg-yellow-400",
    },
    green: {
      gradient: "from-[#061a0f] via-[#0d1519] to-[#0a1a0f]",
      border: "border-green-400/30",
      accent: "from-green-400 via-emerald-500 to-transparent",
      text: "from-green-300 via-green-400 to-emerald-500",
      glow: "bg-green-400/5 group-hover:bg-green-400/10",
      glowSmall: "bg-emerald-500/5",
      shadow: "shadow-green-400/10 hover:shadow-green-400/20",
      progressBar: "from-green-500 to-green-400",
      progressShadow: "shadow-green-400/50",
      iconColor: "text-green-400",
      iconBg: "bg-green-400/10",
      iconBorder: "border-green-400/30",
      iconGlow: "bg-green-400/20",
      pulseColor: "bg-green-400",
      orbiting: "bg-green-400",
    },
    red: {
      gradient: "from-[#1a0606] via-[#0d1519] to-[#1a0a0a]",
      border: "border-red-400/30",
      accent: "from-red-400 via-rose-500 to-transparent",
      text: "from-red-300 via-red-400 to-rose-500",
      glow: "bg-red-400/5 group-hover:bg-red-400/10",
      glowSmall: "bg-rose-500/5",
      shadow: "shadow-red-400/10 hover:shadow-red-400/20",
      progressBar: "from-red-500 to-red-400",
      progressShadow: "shadow-red-400/50",
      iconColor: "text-red-400",
      iconBg: "bg-red-400/10",
      iconBorder: "border-red-400/30",
      iconGlow: "bg-red-400/20",
      pulseColor: "bg-red-400",
      orbiting: "bg-red-400",
    },
  };

  const currentColor = colors[color];
  const chart = [
    <BarChartIcon color={currentColor.iconColor} />,
    <PieChartIcon color={currentColor.iconColor} />,
    <TimelineIcon color={currentColor.iconColor} />,
    <InsightsIcon color={currentColor.iconColor} />,
    <TrendingUpIcon color={currentColor.iconColor} />,
    <CandlestickChartIcon color={currentColor.iconColor} />,
    <StackedBarChartIcon color={currentColor.iconColor} />,
    <AutoGraphIcon color={currentColor.iconColor} />
  ]

  return (
    <div
      onClick={() => path && navigate(path)}
      className={`bg-gradient-to-br ${currentColor.gradient} rounded-2xl p-6 border ${currentColor.border} shadow-xl ${currentColor.shadow} relative overflow-hidden group transition-all duration-300`}
    >

      {/* Animated background effects */}
      <div className={`absolute top-0 right-0 w-40 h-40 ${currentColor.glow} rounded-full blur-3xl transition-all duration-500`}></div>
      <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${currentColor.glowSmall} rounded-full blur-2xl`}></div>

      {/* Accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${currentColor.accent}`}></div>

      {/* Decorative corner elements */}
      <div className={`absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 ${currentColor.border} rounded-tr-2xl opacity-50`}></div>
      <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 ${currentColor.border} rounded-bl-2xl opacity-30`}></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${currentColor.pulseColor} animate-pulse`}></div>
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{title}</p>
        </div>

        <h2 className="text-3xl font-bold mb-1">
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentColor.text}`}>
            {value}
          </span>
        </h2>
      </div>

      {/* Icon Area */}
      <div className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center">
        <div className="relative">
          {/* Glow effect behind icon */}
          <div className={`absolute inset-0 ${currentColor.iconGlow} rounded-full blur-xl animate-pulse`}></div>

          {/* Icon container with gradient border */}
          <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${currentColor.iconBg} to-transparent p-0.5`}>
            <div className="w-full h-full rounded-full bg-[#0d1519] flex items-center justify-center backdrop-blur-sm">
              <div className={`${currentColor.iconColor} transform group-hover:scale-110 transition-transform duration-300 text-xl`}>
                {icon === "user" ? <AccountTreeIcon /> : chart[Math.floor(Math.random() * chart.length)] || <PaidIcon />}
              </div>
            </div>
          </div>

          {/* Orbiting dot */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2">
            <div className={`absolute top-0 left-1/2 w-1.5 h-1.5 ${currentColor.orbiting} rounded-full -translate-x-1/2 animate-ping`}></div>
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${color}-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000`}></div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const navigate = useNavigate();
  const functionTOCopy = (value) => {
    copy(value);
    // alert("Copied to clipboard!");
    toast.success("Copied to clipboard!", { id: 1 });
  };
  const { data: profile_data, isLoading: profileloading } = useQuery(
    ["profile_api"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile_data?.data?.result?.[0] || [];

  const { data: dashboard_Api, isLoading } = useQuery(
    ["dashboard_api"],
    () => apiConnectorGet(endpoint?.user_dashboard_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const dashboard = dashboard_Api?.data?.result?.[0] || [];
  const { data: dashboard_Business_Api, isLoading: isBusinessLoading } = useQuery(
    ["dashboard_business_api"],
    () => apiConnectorGet(endpoint?.user_dashboard_business_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const dashboardBusiness = dashboard_Business_Api?.data?.result || [];
  const { data: newsAndUpdatesApi, isLoading: isNewsLoading } = useQuery(
    ["get_news_and_updates"],
    () => apiConnectorGet(endpoint?.get_news_and_updates),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const newsAndUpdates = newsAndUpdatesApi?.data?.result || [];

  return (
    <div className="min-h-screen  text-white px-2 ">
      <Loader isLoading={profileloading || isLoading || isNewsLoading} />
      <NewsTicker items={newsAndUpdates?.filter((i) => i.m01_nw_status)
        ?.map((i) => i.m01_nw_news)} />
      {/* ===== TOP ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Current Slab */}
        {/* <div className="bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] rounded-2xl p-6 border border-cyan-400/30 shadow-xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-all duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-cyan-500 to-transparent"></div>

          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/10 rounded-bl-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Fund Wallet</p>
            </div>

            <h2 className="text-3xl font-bold mb-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500">
                ${getFloatingValue(user_profile?.tr03_fund_wallet)}
              </span>
            </h2>

       
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-400/50"
                  style={{ width: `${(user_profile?.tr03_fund_wallet || 1) * 10}%` }}
                ></div>
              </div>
              <span className="text-xs text-cyan-400 font-semibold">{(user_profile?.tr03_fund_wallet || 1) * 10}%</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 w-20 h-20 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>

              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent p-0.5">
                <div className="w-full h-full rounded-full bg-[#0d1519] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-cyan-400 transform group-hover:scale-110 transition-transform duration-300">
                    <PieChartIcon />
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2 animate-ping"></div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
        </div> */}

        {/* Remaining Amount */}
        {/* <div className="bg-gradient-to-br from-[#1a1406] via-[#0d1519] to-[#1a0f06] rounded-2xl p-6 border border-yellow-400/30 shadow-xl shadow-yellow-400/10 relative overflow-hidden group hover:shadow-yellow-400/20 transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-all duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-amber-500 to-transparent"></div>

          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-yellow-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-400/10 rounded-bl-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Topoup Wallet</p>
            </div>

            <h2 className="text-3xl font-bold mb-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                ${getFloatingValue(user_profile?.tr03_topup_wallet)}
              </span>
            </h2>

            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500 font-medium">Your trading amount</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-yellow-400/50"
                  style={{
                    width: `${((Number(user_profile?.tr03_topup_wallet || 0) / Number(user_profile?.tr03_topup_wallet || 1)) * 100)}%`
                  }}
                ></div>
              </div>
              <span className="text-xs text-yellow-400 font-semibold">
                {Number(user_profile?.tr03_topup_wallet || 0) > 0 ? "100%" : "0%"}
              </span>


            </div>
          </div>

          <div className="absolute top-4 right-4 w-20 h-20 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>

              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/10 to-transparent p-0.5">
                <div className="w-full h-full rounded-full bg-[#0d1519] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-yellow-400 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <TimelineIcon />
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full -translate-x-1/2 opacity-60">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>

          {(Number(user_profile?.slab_amount || 0) - Number(user_profile?.slab_comp_amount || 0)) < 100 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-400 font-medium">Almost Complete!</span>
            </div>
          )}
        </div> */}
        {/* Active Topup & Balance Card */}
        <div className="bg-gradient-to-br from-[#060d1a] via-[#080f1e] to-[#060a14] rounded-2xl p-6 border border-blue-400/30 shadow-xl shadow-blue-400/10 relative overflow-hidden group hover:shadow-blue-400/20 transition-all duration-300">

          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-all duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"></div>

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-400/10 rounded-bl-2xl"></div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>

          {/* Particles */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-20 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-20 w-1 h-1 bg-blue-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>

          {/* ===== TOP SECTION - Active Topup ===== */}
          <div className="relative z-10 mb-5">
            <div className="flex items-start justify-between">
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Capital Wallet</p>
                </div>

                {/* Value */}
                <h2 className="text-3xl font-bold mb-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                    {getFloatingValue(user_profile?.tr03_topup_wallet)}USD
                  </span>
                </h2>

                {/* Tether icon row */}
                <div className="flex items-center gap-2 mt-1">
                  <div className=" rounded-full  flex items-center justify-center ">
                    <img src={tether} alt="" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Active Topup</span>
                </div>
              </div>

              {/* Deposit Button with icon glow area */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                <button
                  onClick={() => navigate("/fund-transfer-to-topup-wallet")}
                  className="relative bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-semibold text-sm px-5 py-2 rounded-full shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-blue-400/60 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
                  </div>
                  <span className="relative z-10">Topup</span>
                </button>
              </div>
            </div>

            {/* Notice text */}
            <div className="mt-4 bg-blue-950/30 rounded-lg py-2 px-3 border border-blue-400/10">
              <p className="text-blue-400/70 text-xs text-center italic">
                Topup/Re-Topup Your Account to continue earning profit &amp; Rewards
              </p>
            </div>
          </div>
          {/* Compounding */}
          <div className="relative z-10 mb-5">
            <div className="flex items-start justify-between">
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Growth Wallet</p>
                </div>

                {/* Value */}
                <h2 className="text-3xl font-bold mb-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                    {getFloatingValue(user_profile?.tr03_compound_wallet)}USD
                  </span>
                </h2>

                {/* Tether icon row */}
                <div className="flex items-center gap-2 mt-1">
                  <div className=" rounded-full  flex items-center justify-center ">
                    <img src={tether} alt="" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Active Auto Compound</span>
                </div>
              </div>

              {/* Deposit Button with icon glow area */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                <button
                  // onClick={() => navigate("/fund-transfer-to-topup-wallet")}
                  className="relative bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-semibold text-sm px-5 py-2 rounded-full shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-blue-400/60 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
                  </div>
                  {/* <span className="relative z-10">Topup</span> */}
                </button>
              </div>
            </div>

            {/* Notice text */}
            {/* <div className="mt-4 bg-blue-950/30 rounded-lg py-2 px-3 border border-blue-400/10">
              <p className="text-blue-400/70 text-xs text-center italic">
                Topup/Re-Topup Your Account to continue earning profit &amp; Rewards
              </p>
            </div> */}
          </div>

          {/* Divider */}
          <div className="relative z-10 flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
          </div>

          {/* ===== MIDDLE SECTION - Fund Wallet (new) ===== */}
          <div className="relative z-10 mb-5">
            <div className="flex items-start justify-between">
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Fund Wallet</p>
                </div>

                {/* Value */}
                <h2 className="text-2xl font-bold mb-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-400 to-emerald-500">
                    ${getFloatingValue(user_profile?.tr03_fund_wallet)}USD
                  </span>
                </h2>

                {/* Tether icon row */}
                <div className="flex items-center gap-2 mt-1">
                  <div className=" rounded-full  flex items-center justify-center ">
                    <img src={tether} alt="" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Available Fund</span>
                </div>
              </div>

              {/* Transfer Button */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
                <button
                  onClick={() => navigate("/topup_data")}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-white font-semibold text-sm px-5 py-2 rounded-full shadow-lg shadow-green-500/40 transition-all duration-300 hover:scale-105 hover:shadow-green-400/60 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
                  </div>
                  <span className="relative z-10">Deposit</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===== BOTTOM SECTION - Balance ===== */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                {/* Label */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Current Balance</p>
                </div>

                {/* Value */}
                <h2 className="text-3xl font-bold mb-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                    {getFloatingValue(user_profile?.tr03_inc_wallet)} USD
                  </span>
                </h2>

                {/* Tether icon row */}
                <div className="flex items-center gap-2 mt-1">
                  <div className=" rounded-full  flex items-center justify-center ">
                    <img src={tether} alt="" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Wallet Balance</span>
                </div>
              </div>

              {/* Withdrawal Button */}
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                <button
                  onClick={() => navigate("/with")}
                  className="relative bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black font-bold text-sm px-5 py-2 rounded-full shadow-lg shadow-yellow-400/40 transition-all duration-300 hover:scale-105 hover:shadow-yellow-300/60 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
                  </div>
                  <span className="relative z-10">Withdrawal</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 space-y-2">
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-yellow-400/50"
                    style={{
                      width: `${Math.min(
                        (Number(user_profile?.tr03_total_income || 0) / (2 * Number(user_profile?.tr03_topup_wallet || 1))) * 100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
                <span className="text-xs text-yellow-400 font-semibold">
                  {Math.min(
                    Math.floor((Number(user_profile?.tr03_total_income || 0) / (2 * Number(user_profile?.tr03_topup_wallet || 1))) * 100),
                    100
                  )}%
                </span>
              </div>

              {/* Caption */}
              <p className="text-[11px] text-gray-500 italic tracking-wide text-center">
                ⚡ Capping calculated at{" "}
                <span className="text-yellow-400/80 font-semibold not-italic">
                  2× Topup Wallet
                </span>{" "}
                — Max:{" "}
                <span className="text-yellow-400/80 font-semibold not-italic">
                  ${Number(user_profile?.tr03_topup_wallet || 0) * 2}
                </span>
              </p>
            </div>
          </div>

        </div>
        {/* Referral */}
        <div className="bg-gradient-to-br from-[#060f1a] via-[#0d1519] to-[#0a1420] rounded-2xl p-6 border border-blue-400/30 shadow-xl shadow-blue-400/10 relative overflow-hidden group hover:shadow-blue-400/20 transition-all duration-300">

          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-all duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-transparent"></div>

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-blue-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/10 rounded-bl-2xl"></div>

          {/* Decorative link icon */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center border border-blue-400/30">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Referral Link</p>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            </div>

            {/* Link Display Box */}
            <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/20 rounded-lg p-4 mb-4 border border-blue-400/20 backdrop-blur-sm relative overflow-hidden group/link">
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover/link:translate-x-[200%] transition-transform duration-1000"></div>
              </div>

              <p
                onClick={() =>
                  functionTOCopy(
                    frontend +
                    "/register?startapp=" +
                    user_profile?.lgn_cust_id
                  )
                }
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-sm break-all text-center font-medium cursor-pointer hover:scale-[1.02] transition-transform duration-200 relative z-10"
              >
                {frontend +
                  "/register?startapp=" +
                  user_profile?.lgn_cust_id}
              </p>
            </div>

            {/* Copy Button */}
            <div className="flex justify-center mb-5">
              <button
                onClick={() =>
                  functionTOCopy(
                    frontend +
                    "/register?startapp=" +
                    user_profile?.lgn_cust_id
                  )
                }
                className="relative px-6 py-2.5 rounded-lg font-semibold text-sm overflow-hidden group/btn transition-all duration-300 hover:scale-105"
              >
                {/* Button background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transition-transform duration-300 group-hover/btn:scale-105"></div>

                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-md"></div>

                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </span>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
            </div>

            {/* Address Section */}
            <div className="text-center">
              <p className="text-gray-400 text-xs font-medium tracking-wide uppercase mb-2">My Customer ID</p>
              <div className="bg-gradient-to-r from-blue-950/20 to-blue-900/10 rounded-lg p-3 border border-blue-400/10 backdrop-blur-sm">
                <p className="text-blue-400 text-sm break-all font-medium">
                  {user_profile?.lgn_cust_id || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Particles effect */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-20 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-20 w-1 h-1 bg-blue-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
        </div>

        {/* Team Stats Card */}
        <div className="bg-gradient-to-br from-[#060d1a] via-[#0a1220] to-[#060f1a] rounded-2xl p-6 border border-blue-500/30 shadow-xl shadow-blue-500/10 relative overflow-hidden group hover:shadow-blue-500/20 transition-all duration-300 mb-6">

          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl"></div>

          {/* Accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-blue-500 to-transparent"></div>

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-400/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-400/10 rounded-bl-2xl"></div>

          {/* Team Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="flex items-center justify-center text-[#FFD700]">
                <Diversity3Icon className="!text-9xl" />
              </div>
            </div>
          </div>

          {/* Stats List */}
          <div className="relative z-10 space-y-3">
            {/* Direct Team */}
            <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2 text-[#FFD700]" >
                <Diversity3Icon />
                <span className="text-gray-300 text-sm font-medium">Direct Member</span>
              </div>
              <span className="text-blue-500 font-bold text-sm  underline" onClick={() => navigate("/referral")}>{user_profile?.tr03_dir_mem || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2 text-[#FFD700]" >
                <Diversity3Icon />
                <span className="text-gray-300 text-sm font-medium">Team Member</span>
              </div>
              <span className="text-blue-500 font-bold text-sm underline" onClick={() => navigate("/downline")}>{user_profile?.tr03_team_mem || 0}</span>
            </div>

            {/* Direct TopUp Member */}
            <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2 text-[#FFD700]" >
                <CurrencyExchangeIcon />
                <span className="text-gray-300 text-sm font-medium">Direct Business</span>
              </div>
              <span className="text-green-500 font-bold text-sm">{getFloatingValue(dashboardBusiness?.direct_business)}</span>
            </div>

            {/* Total Income */}
            <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2 text-[#FFD700]" >
                <CurrencyExchangeIcon />
                <span className="text-gray-300 text-sm font-medium">Team Bussiness</span>
              </div>
              <span className="text-green-500 font-bold text-sm">{getFloatingValue(dashboardBusiness?.team_business)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2 text-[#FFD700]" >
                <EmojiEventsIcon />
                <span className="text-gray-300 text-sm font-medium">Current Rank</span>
              </div>
              <span className="text-green-500 font-bold text-sm">{user_profile?.tr03_rank > 0 ? 'V'+user_profile?.tr03_rank : "—"}</span>
            </div>

            {/* TopUp Amount */}
            {/* <div className="flex items-center justify-between py-2 border-b border-blue-400/10">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 10h3v7H4zm6.5-6h3v13h-3zM17 7h3v10h-3z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium">TopUp Amount</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 font-bold text-sm">
                ${getFloatingValue(user_profile?.tr03_topup_wallet || 0)}
              </span>
            </div> */}

            {/* Team Income */}
            {/* <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium">Team Income</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-500 font-bold text-sm">
                ${getFloatingValue(dashboard?.team_income || 0)}
              </span>
            </div> */}
          </div>

          {/* Particles effect */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-20 right-16 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-20 w-1 h-1 bg-yellow-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>

          {/* Extra Particles (added) */}
          <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-70 animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-6 left-16 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute top-1/3 right-4 w-1 h-1 bg-blue-200 rounded-full opacity-50 animate-ping" style={{ animationDelay: '1.6s' }}></div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>

          {/* Signature / watermark */}
          <div className="absolute bottom-3 right-3 text-xs text-white/20 italic tracking-wide rotate-[-6deg] pointer-events-none">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Verified Team Stats</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        <Card
          title="Earning Wallet"
          value={`$${getFloatingValue(user_profile?.tr03_inc_wallet)}`}
          color="cyan"
          path=""
          navigate={navigate}
        />
        <Card
          title="Trading Income"
          value={`$${getFloatingValue(dashboard?.roi_bonus || 0)}`}
          color="cyan"
          path="/income/roi"
          navigate={navigate}
        />
        <Card
          title="Sponsor Income"
          value={`$${getFloatingValue(dashboard?.referral_income)}`}
          color="red"
          path="/income/direct"
          navigate={navigate}
        />
        {/* <Card title="Total Capping" value="3X" color="green" /> */}
        {/* <Card title="Profit Ratio" value="$ 0" color="yellow" /> */}

        <Card
          title="Community Level Income"
          value={`$${getFloatingValue(dashboard?.level_bonus || 0)}`}
          color="cyan"
          path="/income/level"
          navigate={navigate}
        />
        <Card
          title="Leadership Rank Bonus"
          value={`$${getFloatingValue(dashboard?.salary_bonus || 0)}`}
          color="red"
          path="/income/salary"
          navigate={navigate}
        />
        
        <Card
          title="Dexon Global Reward Pool"
          value={`$${getFloatingValue(dashboard?.reward_bonus || 0)}`}
          color="red"
          path="/income/reward"
          navigate={navigate}
        />
        {/* <Card
          title="Salary Income"
          value={`$${getFloatingValue(dashboard?.salary_bonus || 0)}`}
          color="green"
          path="/income/salary"
          navigate={navigate}
        /> */}
        <Card
          title="Total Earning"
          value={`$${getFloatingValue(dashboard?.total_income || 0)}`}
          color="yellow"
          path=""
          navigate={navigate}
        />

        {/* <Card title="Total Withdrawal" value="$ 0" color="cyan" icon="user" /> */}
        {/* <Card
          title="Direct Member"
          value={user_profile?.tr03_dir_mem || 0}
          color="red"
        />
        <Card
          title="Team Member"
          value={user_profile?.tr03_team_mem || 0}
          color="green"
          icon="user"
        /> */}
        {/* <Card title="Downline Team" value="0" color="yellow" /> */}

        {/* <Card
          title="Downline Business"
          value={user_profile?.jnr_team_topup_bal || 0}
          color="cyan"
          icon="user"
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;

const NewsTicker = ({ items }) => {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center my-2"
      style={{
        background: 'linear-gradient(90deg, rgba(6,13,20,0.98) 0%, rgba(10,18,25,0.95) 100%)',
        border: '1px solid rgba(34,211,238,0.15)',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)',
        height: '42px',
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      {/* LIVE badge */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full z-10 relative"
        style={{
          background: 'linear-gradient(90deg, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.05) 100%)',
          borderRight: '1px solid rgba(34,211,238,0.2)',
          minWidth: '72px',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
        <span
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'rgba(34,211,238,0.9)' }}
        >
          LIVE
        </span>
      </div>

      {/* Left fade overlay */}
      <div
        className="absolute left-[72px] top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(10,18,25,0.95), transparent)' }}
      />

      {/* Scrolling ticker track */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="ticker-track flex items-center gap-0 whitespace-nowrap">
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <span
                className="text-sm font-medium px-2"
                style={{ color: 'rgba(203,213,225,0.85)' }}
              >
                {item}
              </span>
              {/* Separator dot */}
              <span
                className="w-1 h-1 rounded-full flex-shrink-0 mx-3"
                style={{ background: 'rgba(34,211,238,0.4)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right fade overlay */}
      <div
        className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
        style={{ background: 'linear-gradient(270deg, rgba(6,13,20,0.98), transparent)' }}
      />

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none" />

      <style>{`
        .ticker-track {
          animation: ticker-scroll 18s linear infinite;
          will-change: transform;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

