import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../../../utils/APIConnector";
import { dollar, endpoint, withdrawalAddress } from "../../../utils/APIRoutes";
import { ethers } from "ethers";
import { getFloatingValue } from "../../../utils/utilityFun";

const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const { data } = useQuery(
    ["get_admin_dashboard"],
    () => apiConnectorGet(endpoint?.admin_dashboard),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching dashboard data:", err),
    }
  );

  const dashboard = data?.data?.result || {};

  const stats = [
    { label: "Total Members", value: getFloatingValue(dashboard?.total_member, 0) },
    { label: "Active Members", value: getFloatingValue(dashboard?.total_active_member, 0) },
    {
      label: "Deactive Members",
      value: getFloatingValue(dashboard?.total_member, 0) - getFloatingValue(dashboard?.total_active_member, 0),
    },
    { label: "Total Referral Bonus", value: `${dollar} ${getFloatingValue(dashboard?.referral_income)}` },
    { label: "Total Community Level Bonus", value: `${dollar} ${getFloatingValue(dashboard?.level_bonus)}` },
    { label: "Total ROI Bonus", value: `${dollar} ${getFloatingValue(dashboard?.roi_bonus)}` },
    { label: "Total Salary Bonus", value: `${dollar} ${getFloatingValue(dashboard?.salary_bonus)}` },
    { label: "Total Reward Bonus", value: `${dollar} ${getFloatingValue(dashboard?.reward_bonus)}` },
    {
      label: "Total Deposit Amount",
      value: `${dollar} ${getFloatingValue(dashboard?.total_deposit)}`,
    },
    {
      label: "Total Withdrawal (Success)",
      value: `${dollar} ${getFloatingValue(dashboard?.total_success_withdrawal)}`,
    },
    {
      label: "Total Withdrawal (Pending)",
      value: `${dollar} ${getFloatingValue(dashboard?.total_pending_withdrawal)}`,
    },
    {
      label: "Total Withdrawal (Failed)",
      value: `${dollar} ${getFloatingValue(dashboard?.total_failed_withdrawal)}`,
    },
    // {
    //   label: "Today Withdrawal",
    //   value: `${dollar} ${getFloatingValue(dashboard?.today_with_amnt, 0)}`,
    // },
    // {
    //   label: "Total Withdrawal",
    //   value: `${dollar} ${dashboard?.total_with_amnt || 0}`,
    // },
    // {
    //   label: "Level Income",
    //   value: `${dollar} ${dashboard?.total_level_income || 0}`,
    // },
    // {
    //   label: "Direct Income",
    //   value: `${dollar} ${dashboard?.total_direct_income || 0}`,
    // },
    // {
    //   label: "ROI Income",
    //   value: `${dollar} ${dashboard?.total_roi_income || 0}`,
    // },
    // {
    //   label: "Current Balance",
    //   value: `BNB ${Number(bal || 0)?.toFixed(4)}`,
    // },
  ];
  async function getBEP20Balance(walletAddress) {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
    const rawBalance = await provider.getBalance(walletAddress);
    const balance = ethers.utils.formatEther(rawBalance);
    setBal(balance);
  }
  useEffect(() => {
    getBEP20Balance(withdrawalAddress);
  }, []);
  // Drop-in replacement for your stats dashboard return block

  return (
    <div className="w-full">

      {/* ─── SECTION HEADER ─── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
          <div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-400 text-lg font-bold tracking-wide">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">Real-time statistics</p>
          </div>
        </div>

        {/* Live indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(34,211,238,0.05)',
            border: '1px solid rgba(34,211,238,0.12)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-gray-500 tracking-widest uppercase">Live</span>
        </div>
      </div>

      {/* ─── STATS GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden group cursor-default transition-all duration-300 hover:translate-y-[-2px]"
            style={{
              background: 'linear-gradient(135deg, rgba(10,18,25,0.95) 0%, rgba(13,24,33,0.90) 100%)',
              border: '1px solid rgba(34,211,238,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              animationDelay: `${index * 80}ms`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.28)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,238,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
            }}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-cyan-400/10 rounded-tr-xl pointer-events-none" />

            {/* Background glow blob */}
            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
              style={{ background: 'rgba(254,214,3,0.08)' }}
            />

            {/* Card content */}
            <div className="relative z-10 p-5">

              {/* Label row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">
                  {item.label}
                </p>
                {/* Index badge */}
                <span
                  className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    background: 'rgba(34,211,238,0.07)',
                    border: '1px solid rgba(34,211,238,0.12)',
                    color: '#fed603',
                  }}
                >
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Value */}
              <h3
                className="text-2xl font-bold mb-3 tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #e2f8ff 0%, #67e8f9 50%, #22d3ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                }}
              >
                {item.value}
              </h3>

              {/* Bottom bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(34,211,238,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:w-full"
                    style={{
                      width: '40%',
                      background: 'linear-gradient(90deg, #fed603, rgba(59,130,246,0.4), transparent)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Left edge accent */}
            <div
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.6), rgba(59,130,246,0.3), transparent)' }}
            />
          </div>
        ))}
      </div>

      {/* ─── FOOTER ─── */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/15 to-transparent" />
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDuration: '2s' }} />
          <span className="text-[10px] text-gray-600 tracking-widest uppercase">
            {stats.length} metrics loaded
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-cyan-400/15 to-transparent" />
      </div>

    </div>
  );
};

export default Dashboard;
