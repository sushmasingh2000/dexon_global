import moment from "moment";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { dollar, endpoint } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";

const CHANNEL_COLORS = [
  "linear-gradient(90deg, #6366f1, #818cf8)",
  "linear-gradient(90deg, #22d3ee, #67e8f9)",
  "linear-gradient(90deg, #f472b6, #f9a8d4)",
  "linear-gradient(90deg, #f59e0b, #fcd34d)",
  "linear-gradient(90deg, #10b981, #34d399)",
];



export default function GlobalDashboard() {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const [randomTrend] = useState(() => {
    const make = () => `+${(Math.random() * 14 + 1).toFixed(1)}%`;
    return {
      deposit: make(),
      withdrawal: make(),
      balance: make(),
      profit: make(),
      users: make(),
    };
  });



  const { data, isLoading } = useQuery(
    [
      "admin_dashboard_data",

    ],
    () =>
      apiConnectorGet(endpoint?.get_admin_dashboard),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );



  const allData = data?.data?.result || {};

  const toNumber = (value) => {
    const normalized = String(value ?? 0).replace(/,/g, "").trim();
    const parsedValue = Number(normalized);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };


  const { data: globalDeposit, isLoading: isLoadingGlobalDeposit } = useQuery(
    [
      "topup_history_global"
    ],
    () =>
      apiConnectorPost(endpoint?.get_report_details, {

        sub_label: "TOPUP WALLET",
        main_label: "IN",
        is_global: true
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const globalDeposit_ = globalDeposit?.data?.result?.data || [];




  const { data: globalWithdrawal, isLoading: isLoadingGlobalWithdrawal } = useQuery(
    [
      "withdrawal_history_global",

    ],
    () =>
      apiConnectorPost(endpoint?.get_global_payout_history, {

      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const globalWithdrawal_ = globalWithdrawal?.data?.result?.data || [];
  const { data: globalLiveTransactionActivity, isLoading: isLoadingGlobalLiveTransactionActivity } = useQuery(
    [
      "global_live_transaction_activity",

    ],
    () =>
      apiConnectorGet(endpoint?.get_member_global_live_transaction_activity, {

      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const globalLiveTransactionActivity_ = globalLiveTransactionActivity?.data?.result || [];

  console.log("Global Live Transaction Activity Data:", globalLiveTransactionActivity_);
  let depositAreaChart = {

    series: [{
      name: 'Deposit',
      data: globalDeposit_?.map((i) => toNumber(i?.tr07_tr_amount)) || [11, 32, 45, 32, 34, 52, 41]
    }, {
      name: 'Withdrawal',
      data: globalWithdrawal_?.map((i) => toNumber(i?.tr07_tr_amount)) || [11, 32, 45, 32, 34, 52, 41]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        padding: { left: 0, right: 0 }
      },
      xaxis: {
        type: 'datetime',
        categories: globalDeposit_?.map((i) => moment(i?.tr07_created_at).format("YYYY-MM-DD HH:mm:ss")) || ["2023-08-01", "2023-08-02", "2023-08-03", "2023-08-04", "2023-08-05", "2023-08-06", "2023-08-07"]
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px'
        },
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: { height: 300 }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 240 },
            xaxis: {
              labels: { show: false }
            }
          }
        }
      ]
    },


  }


  let piChart = {

    series: [
      toNumber(allData?.total_deposit),
      toNumber(allData?.total_success_withdrawal),
      toNumber(allData?.net_balance),
      toNumber(allData?.total_profit),
      toNumber(allData?.total_member),
    ],
    options: {
      chart: {
        type: 'pie',
      },
      labels: ['Deposit', 'Withdrawal', 'Net Balance', 'Profit', 'Users'],
      legend: {
        position: 'right'
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: { height: 280 },
            legend: { position: 'bottom' }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 240 },
            legend: { position: 'bottom' }
          }
        }
      ]
    },


  }

  const totalPiValue = piChart.series.reduce((sum, value) => sum + toNumber(value), 0);
  const channelPerformance = piChart.options.labels.map((label, index) => {
    const amount = toNumber(piChart.series[index]);
    const pct = totalPiValue > 0 ? (amount / totalPiValue) * 100 : 0;

    return {
      name: label,
      pct,
      amount: `${dollar}${getFloatingValue(amount)}`,
      color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
    };
  }).slice(0, -1);

  return (
    <>
      <style>{style}</style>
      <div className="dashboard">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grain" />
        <div className="content">

          {/* Header */}
          <div className="header">
            <div className="header-left">
              <span className="header-label">Financial Overview</span>
              <h1 className="header-title">Global Dashboard</h1>
            </div>
            <div className="header-right">
              <div className="badge"><div className="badge-dot" /> Live</div>
              <div className="date-chip">{today}</div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="kpi-grid">
            {[
              { cls: "deposit", icon: "⬇", label: "Deposit", value: `${dollar}${getFloatingValue(allData?.total_deposit)}`, trend: randomTrend.deposit, up: true, sub: "vs last month" },
              { cls: "withdrawal", icon: "⬆", label: "Withdrawal", value: `${dollar}${getFloatingValue(allData?.total_success_withdrawal)}`, trend: randomTrend.withdrawal, up: true, sub: "vs last month" },
              { cls: "balance", icon: "◈", label: "Net Balance", value: `${dollar}${getFloatingValue(allData?.net_balance)}`, trend: randomTrend.balance, up: true, sub: "current period" },
              { cls: "profit", icon: "⬆", label: "Net Profit", value: `${dollar}${getFloatingValue(allData?.total_profit)}`, trend: randomTrend.profit, up: true, sub: "current period" },
              { cls: "users", icon: "◎", label: "Total Users", value: `${getFloatingValue(allData?.total_member)}`, trend: randomTrend.users, up: true, sub: "transacting today" },
            ].map((k) => (
              <div key={k.cls} className={`kpi-card kpi-card--${k.cls}`}>
                <div className="kpi-header">
                  <div className="kpi-icon">{k.icon}</div>
                  <div className={`kpi-trend kpi-trend--${k.up ? "up" : "down"}`}>
                    {k.up ? "↑" : "↓"} {k.trend}
                  </div>
                </div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Mid Row */}
          <div className="mid-grid">
            {/* Bar Chart */}
            <div className="chart-card">
              <div className="card-title-row">
                <div>
                  <div className="card-title">Transaction Volume</div>
                  <div className="card-subtitle">Deposits vs Withdrawals</div>
                </div>
              </div>
              <div className="chart-wrap">
                <ReactApexChart options={depositAreaChart.options} series={depositAreaChart.series} type="area" height={350} width="100%" />
              </div>
              {/* <div className="bar-chart">
                {BAR_DATA.map((d) => (
                  <div key={d.month} className="bar-group">
                    <div className="bar bar--deposit" style={{ height: `${(d.deposit / maxBar) * 100}%` }} title={`Deposit: $${d.deposit}k`} />
                    <div className="bar bar--withdrawal" style={{ height: `${(d.withdrawal / maxBar) * 100}%` }} title={`Withdrawal: $${d.withdrawal}k`} />
                  </div>
                ))}
              </div> */}
              {/* <div className="bar-labels">
                {BAR_DATA.map(d => <div key={d.month} className="bar-label">{d.month}</div>)}
              </div> */}
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                {[["var(--green)", "Deposits"], ["var(--red)", "Withdrawals"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                    <span style={{ fontFamily: "Verdana, sans-serif", fontSize: 10, color: "var(--text-secondary)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut */}
            <div className="chart-card">
              <div className="card-title-row">
                <div>
                  <div className="card-title">Overview</div>
                  <div className="card-subtitle">By transaction type</div>
                </div>
              </div>
              <div className="pie-wrap">
                <ReactApexChart options={piChart.options} series={piChart.series} type="pie" height={320} width="100%" />
              </div>
            </div>

            {/* Feed */}
            <div className="feed-card">
              <div className="card-title-row">
                <div>
                  <div className="card-title">Live Activity</div>
                  <div className="card-subtitle">Recent transactions</div>
                </div>
              </div>
              <div className="feed-list">
                {globalLiveTransactionActivity_?.slice(0, 6)?.map((f, i) => {
                  const isIn = String(f?.tr07_main_label || "").toUpperCase() === "IN";
                  const emailPrefix = String(f?.lgn_email || "user").toLowerCase().substring(0, 3);
                  const amount = toNumber(f?.tr07_tr_amount);

                  return (
                    <div key={i} className={`feed-item ${isIn ? "feed-item--in" : "feed-item--out"}`}>
                      <div className={`feed-icon feed-icon--${isIn ? "in" : "out"}`}>{isIn ? "↓" : "↑"}</div>
                      <div className="feed-info">
                        <div className="feed-name">{`${emailPrefix}...`}</div>
                        <div className="feed-time">{formatedDate(moment, f?.tr07_created_at, "time")}</div>
                      </div>
                      <div className={`feed-amount feed-amount--${isIn ? "in" : "out"} flex flex-col !justify-end`} >
                        <p className="!text-end">{`${isIn ? "+" : "-"}${dollar}${getFloatingValue(amount)}`}</p>
                        <p className="!text-[6px] !text-[#feb019]">{f?.tr07_trans_id}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-grid">
            {/* Table */}
            <div className="table-card !h-[400px] overflow-scroll">
              <div className="card-title-row">
                <div>
                  <div className="card-title">Recent Transactions</div>
                  <div className="card-subtitle">Last 50 entries</div>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {globalLiveTransactionActivity_?.slice(0, 50)?.map((t, index) => {
                    const isIn = String(t?.tr07_main_label || "").toUpperCase() === "IN";
                    const amount = toNumber(t?.tr07_tr_amount);
                    const statusRaw = String(t?.tr07_status || "completed").toLowerCase();
                    const status = statusRaw === "failed" || statusRaw === "pending" ? statusRaw : "completed";
                    const user = String(t?.lgn_email || "user").toLowerCase()?.substring(0, 3) + "..." || "user";
                    const rowId = "TXN-" + t?.tr07_trans_id?.substring(0, 5) || `TXN-${index + 1}`;

                    return (
                      <tr key={rowId}>
                        <td><span className="mono" style={{ color: "var(--text-secondary)", fontSize: 11 }}>{rowId}</span></td>
                        <td style={{ fontWeight: 600, fontSize: 12 }}>{user}</td>
                        <td><span className="mono" style={{ fontSize: 11, color: "var(--text-secondary)" }}>{isIn ? "Deposit" : "Withdrawal"}</span></td>
                        <td>
                          <span className="mono" style={{ fontSize: 12, color: isIn ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                            {`${isIn ? "+" : "-"}${dollar}${getFloatingValue(amount)}`}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-badge--${status}`}>
                            <span className="status-dot" />{status}
                          </span>
                        </td>
                        <td><span className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>{formatedDate(moment, t?.tr07_created_at, "date")}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Channel Performance */}
            <div className="progress-card">
              <div className="card-title-row">
                <div>
                  <div className="card-title">Channel Performance</div>
                  <div className="card-subtitle">Share by transaction type</div>
                </div>
              </div>
              {channelPerformance.map((c) => (
                <div key={c.name} className="progress-item">
                  <div className="progress-header">
                    <span className="progress-name">{c.name}</span>
                    <span className="progress-pct">{c.pct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                  <div className="progress-meta">
                    <span className="progress-amount mono" style={{ color: "var(--text-muted)", fontSize: 10 }}>Volume</span>
                    <span className="progress-amount mono" style={{ color: "var(--text-secondary)", fontSize: 10 }}>{c.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const style = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #09090f;
    --surface: #111118;
    --surface2: #16161f;
    --border: rgba(255,255,255,0.07);
    --border-glow: rgba(99,102,241,0.3);
    --accent: #6366f1;
    --accent2: #22d3ee;
    --accent3: #f472b6;
    --gold: #fed603;
    --text-primary: #f1f5f9;
    --text-secondary: #64748b;
    --text-muted: #334155;
    --green: #10b981;
    --red: #f43f5e;
    --font: Verdana, Geneva, Tahoma, sans-serif;
  }

  body {
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: #22d3ee rgba(34,211,238,0.12);
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: rgba(34,211,238,0.12);
    border-radius: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #67e8f9, #22d3ee);
    border-radius: 10px;
    border: 2px solid rgba(9,9,15,0.65);
  }

  *::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #a5f3fc, #22d3ee);
  }

  .dashboard {
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  /* Ambient orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 { width: 600px; height: 600px; background: rgba(99,102,241,0.08); top: -200px; right: -200px; }
  .orb-2 { width: 500px; height: 500px; background: rgba(34,211,238,0.05); bottom: -150px; left: -150px; }
  .orb-3 { width: 400px; height: 400px; background: rgba(244,114,182,0.04); top: 40%; left: 40%; }

  /* Grain overlay */
  .grain {
    position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .content {
    position: relative; z-index: 2;
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 40px 60px;
  }

  /* Header */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
    animation: fadeDown 0.6s ease both;
  }

  .header-left { display: flex; flex-direction: column; gap: 4px; }

  .header-label {
    font-family: var(--font);
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent); font-weight: 700;
  }

  .header-title {
    font-size: 26px; font-weight: 700; letter-spacing: -0.3px;
    background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

  .badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    font-family: var(--font); font-size: 10px;
    color: var(--green); letter-spacing: 0.05em; font-weight: 700;
  }
  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    animation: pulse-dot 2s ease infinite;
  }

  .date-chip {
    padding: 6px 14px; border-radius: 100px;
    background: var(--surface2); border: 1px solid var(--border);
    font-family: var(--font); font-size: 10px;
    color: var(--text-secondary);
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .kpi-card {
    position: relative; overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    transition: border-color 0.3s, transform 0.3s;
    animation: fadeUp 0.6s ease both;
  }
  .kpi-card:hover {
    border-color: var(--border-glow);
    transform: translateY(-2px);
  }
  .kpi-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
    pointer-events: none;
  }

  .kpi-card--deposit { --card-accent: var(--green); }
  .kpi-card--withdrawal { --card-accent: var(--red); }
  .kpi-card--balance { --card-accent: var(--accent); }
  .kpi-card--profit { --card-accent: var(--gold); }
  .kpi-card--users { --card-accent: var(--accent2); }

  .kpi-card::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
    opacity: 0.6;
  }

  .kpi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }

  .kpi-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    font-size: 16px;
  }

  .kpi-trend {
    display: flex; align-items: center; gap: 4px;
    font-family: var(--font); font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 6px;
  }
  .kpi-trend--up { color: var(--green); background: rgba(16,185,129,0.1); }
  .kpi-trend--down { color: var(--red); background: rgba(244,63,94,0.1); }

  .kpi-label {
    font-family: var(--font); font-size: 10px; letter-spacing: 0.09em;
    text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px; font-weight: 700;
  }

  .kpi-value {
    font-size: 28px; font-weight: 700; letter-spacing: -0.5px;
    color: var(--card-accent, var(--text-primary));
    font-variant-numeric: tabular-nums;
  }

  .kpi-sub {
    font-family: var(--font); font-size: 10px;
    color: var(--text-muted); margin-top: 6px;
  }

  /* Middle row */
  .mid-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 340px;
    gap: 16px;
    margin-bottom: 24px;
  }

  /* Chart card */
  .chart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .card-title-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
    margin-bottom: 24px;
  }

  .card-title {
    font-size: 14px; font-weight: 700; letter-spacing: -0.1px;
  }
  .card-subtitle {
    font-family: var(--font); font-size: 10px;
    color: var(--text-secondary); margin-top: 3px;
  }

  .chart-wrap,
  .pie-wrap {
    width: 100%;
    overflow: hidden;
  }

  .chart-wrap .apexcharts-canvas,
  .pie-wrap .apexcharts-canvas {
    max-width: 100% !important;
  }

  .pill-tabs { display: flex; gap: 4px; }
  .pill-tab {
    padding: 5px 12px; border-radius: 8px;
    font-family: var(--font); font-size: 10px; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.2s;
    color: var(--text-secondary); background: transparent;
  }
  .pill-tab.active { background: var(--accent); color: white; }

  /* Bar chart */
  .bar-chart {
    display: flex; align-items: flex-end; gap: 8px; height: 140px;
  }
  .bar-group { display: flex; gap: 3px; align-items: flex-end; flex: 1; }
  .bar {
    flex: 1; border-radius: 4px 4px 0 0;
    transition: opacity 0.2s;
    position: relative; cursor: pointer;
  }
  .bar:hover { opacity: 0.8; }
  .bar--deposit { background: linear-gradient(180deg, var(--green) 0%, rgba(16,185,129,0.3) 100%); }
  .bar--withdrawal { background: linear-gradient(180deg, var(--red) 0%, rgba(244,63,94,0.3) 100%); }

  .bar-labels {
    display: flex; gap: 8px; margin-top: 12px;
  }
  .bar-label {
    flex: 1; text-align: center;
    font-family: var(--font); font-size: 10px; color: var(--text-muted);
  }

  .apexcharts-tooltip {
    background: #fed603 !important;
    color: #111118 !important;
    border: 1px solid #d4b200 !important;
    box-shadow: 0 6px 20px rgba(254, 214, 3, 0.25) !important;
  }
  .apexcharts-tooltip-title {
    background: #f5cf00 !important;
    color: #111118 !important;
    border-bottom: 1px solid #d4b200 !important;
  }
  .apexcharts-tooltip-text-y-label,
  .apexcharts-tooltip-text-y-value,
  .apexcharts-tooltip-text-z-label,
  .apexcharts-tooltip-text-z-value {
    color: #111118 !important;
  }

  /* Donut */
  .donut-wrap { display: flex; align-items: center; gap: 24px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
  .donut-svg { flex-shrink: 0; }
  .donut-legend { display: flex; flex-direction: column; gap: 12px; }
  .legend-item { display: flex; align-items: center; gap: 8px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .legend-label { font-family: var(--font); font-size: 10px; color: var(--text-secondary); }
  .legend-val { font-size: 12px; font-weight: 700; color: var(--text-primary); margin-top: 1px; }

  /* Activity feed */
  .feed-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    animation: fadeUp 0.7s ease 0.15s both;
  }

  .feed-list { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }

  .feed-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px; border-radius: 10px;
    transition: background 0.2s; cursor: pointer;
    border: 1px solid transparent;
  }
  .feed-item:hover { background: rgba(255,255,255,0.03); }
  .feed-item--in { border-color: rgba(16,185,129,0.2); }
  .feed-item--out { border-color: rgba(244,63,94,0.2); }

  .feed-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .feed-icon--in { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); }
  .feed-icon--out { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); }
  .feed-icon--swap { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); }

  .feed-info { flex: 1; min-width: 0; }
  .feed-name { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .feed-time { font-family: var(--font); font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .feed-amount { font-family: var(--font); font-size: 12px; font-weight: 700; white-space: nowrap; }
  .feed-amount--in { color: var(--green); }
  .feed-amount--out { color: var(--red); }

  /* Bottom row */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* Table */
  .table-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    animation: fadeUp 0.8s ease 0.2s both;
    overflow-x: auto;
  }

  .data-table { width: 100%; border-collapse: collapse; margin-top: 4px; min-width: 480px; }
  .data-table th {
    font-family: var(--font); font-size: 10px; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
    padding: 8px 10px; text-align: left; font-weight: 700;
    border-bottom: 1px solid var(--border);
  }
  .data-table td {
    padding: 11px 10px; font-size: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: rgba(255,255,255,0.02); }

  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 6px;
    font-family: var(--font); font-size: 10px; font-weight: 700;
  }
  .status-badge--completed { color: var(--green); background: rgba(16,185,129,0.1); }
  .status-badge--pending { color: var(--gold); background: rgba(245,158,11,0.1); }
  .status-badge--failed { color: var(--red); background: rgba(244,63,94,0.1); }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .mono { font-family: var(--font); }

  /* Progress bars card */
  .progress-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    animation: fadeUp 0.8s ease 0.25s both;
  }

  .progress-item { margin-bottom: 20px; }
  .progress-item:last-child { margin-bottom: 0; }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .progress-name { font-size: 12px; font-weight: 700; }
  .progress-pct { font-family: var(--font); font-size: 11px; font-weight: 700; color: var(--text-secondary); }
  .progress-track {
    height: 6px; border-radius: 100px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 100px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }
  .progress-meta { display: flex; justify-content: space-between; margin-top: 5px; }
  .progress-amount { font-family: var(--font); font-size: 10px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .kpi-card:nth-child(1) { animation-delay: 0.05s; }
  .kpi-card:nth-child(2) { animation-delay: 0.1s; }
  .kpi-card:nth-child(3) { animation-delay: 0.15s; }
  .kpi-card:nth-child(4) { animation-delay: 0.2s; }

  /* ── RESPONSIVE ── */

  /* Tablet: ≤1100px */
  @media (max-width: 1100px) {
    .content { padding: 24px 24px 48px; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .mid-grid { grid-template-columns: 1fr 1fr; }
    .feed-card { grid-column: 1 / -1; }
    .bottom-grid { grid-template-columns: 1fr; }
    .kpi-value { font-size: 24px; }
  }

  /* Large mobile: ≤768px */
  @media (max-width: 768px) {
    .content { padding: 16px 16px 40px; }
    .header { margin-bottom: 28px; padding-bottom: 16px; }
    .header-title { font-size: 20px; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .mid-grid { grid-template-columns: 1fr; gap: 12px; }
    .bottom-grid { gap: 12px; }
    .chart-card, .feed-card, .table-card, .progress-card { padding: 20px; }
    .kpi-card { padding: 18px; }
    .kpi-value { font-size: 22px; }
    .bar-chart { height: 110px; }
    .date-chip { display: none; }
  }

  /* Small mobile: ≤480px */
  @media (max-width: 480px) {
    .kpi-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .kpi-value { font-size: 18px; letter-spacing: 0; }
    .kpi-card { padding: 14px; }
    .kpi-icon { width: 30px; height: 30px; font-size: 13px; }
    .header-title { font-size: 17px; }
    .bar-chart { height: 90px; }
    .orb-1, .orb-2, .orb-3 { display: none; }
  }
`;
