import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { MenuItem, Select } from "@mui/material";
import CustomToPagination from "../../../Shared/Pagination";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";

const Downline = () => {
  const [level, setLevel] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { isLoading, data: team_data } = useQuery(
    ["get_direct_member", level, page, limit],
    () =>
      apiConnectorPost(`${endpoint?.team_data_api}`, {
        level_id: level,
        page: page,
        limit: limit,
      }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const data = team_data?.data?.result || [];

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setPage(1);
  };

  const tablehead = [
    <span>S.No.</span>,
    <span>Cust ID</span>,
    <span>Name</span>,
    <span>Level</span>,
    <span>TopUp ($)</span>,
    <span>Join Date</span>,
    <span>TopUp Date</span>,
  ];

  const tablerow = data?.data?.map((row, index) => [
    <span>{index + 1}</span>,
    <span>{row.lgn_cust_id}</span>,
    <span>{row.lgn_name}</span>,
    <span>{row.level_id || "N/A"}</span>,
    <span>{getFloatingValue(row.tr03_topup_wallet)}</span>,
    <span>{formatedDate(moment, row.tr03_reg_date)}</span>,
    <span>{formatedDate(moment, row.tr03_topup_date)}</span>,
  ]);

  return (
    <div
      className="p-4 min-h-screen"
      style={{ background: "linear-gradient(135deg, #060d1a 0%, #080f1e 50%, #060a14 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Page Heading */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 tracking-wide">
            My Team Members
          </h2>
        </div>
        <div className="ml-4 h-px bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
      </div>

      {/* Level Selector + Stats Card */}
      <div
        className="relative rounded-xl p-4 mb-5 border border-cyan-400/20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(6,13,26,0.9) 0%, rgba(8,15,30,0.9) 100%)" }}
      >
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="text-cyan-400 text-sm font-semibold tracking-wider uppercase whitespace-nowrap">
            Select Level:
          </label>

          <Select
            value={level}
            onChange={(e) => handleLevelChange(Number(e.target.value))}
            size="small"
            sx={{
              minWidth: 180,
              color: "#22d3ee",
              fontWeight: 600,
              fontSize: "14px",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(34,211,238,0.35)",
                borderRadius: "10px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(34,211,238,0.7)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#22d3ee",
              },
              ".MuiSvgIcon-root": { color: "#22d3ee" },
              background: "rgba(6,13,26,0.8)",
              borderRadius: "10px",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: "linear-gradient(135deg, #060d1a, #080f1e)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  borderRadius: "10px",
                  boxShadow: "0 8px 32px rgba(34,211,238,0.1)",
                  "& .MuiMenuItem-root": {
                    color: "#67e8f9",
                    fontSize: "13px",
                    fontWeight: 500,
                    "&:hover": { background: "rgba(34,211,238,0.1)", color: "#22d3ee" },
                    "&.Mui-selected": {
                      background: "rgba(34,211,238,0.15)",
                      color: "#22d3ee",
                      "&:hover": { background: "rgba(34,211,238,0.2)" },
                    },
                  },
                },
              },
            }}
          >
            {[...Array(15)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                Level {index + 1}
              </MenuItem>
            ))}
          </Select>

          {/* Stats badges */}
          <div className="flex gap-3 md:ml-auto flex-wrap">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-400/20"
              style={{ background: "rgba(34,211,238,0.06)" }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Count:</span>
              <span className="text-cyan-400 font-bold text-sm">{data?.data?.length || 0}</span>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-400/20"
              style={{ background: "rgba(56,189,248,0.06)" }}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Business:</span>
              <span className="text-sky-400 font-bold text-sm">
                $
                {data?.data
                  ?.reduce((a, b) => a + Number(b?.tr03_topup_wallet || 0), 0)
                  ?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div
        className="relative rounded-xl border border-cyan-400/20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(6,13,26,0.95) 0%, rgba(8,15,30,0.95) 100%)" }}
      >
        <div className="h-0.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/10 rounded-tr-xl pointer-events-none"></div>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-400/10">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">
            Level {level} Members
          </span>
        </div>

        <div className="px-2 py-3">
          <CustomTable
            tablehead={tablehead}
            tablerow={tablerow}
            isLoading={isLoading}
          />
        </div>

        <div className="border-t border-cyan-400/10 px-4 py-3">
          <CustomToPagination page={page} setPage={setPage} data={data} />
        </div>
      </div>

      {/* Cyan table override styles */}
      <style>{`
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        thead tr {
          background: linear-gradient(90deg, rgba(34,211,238,0.12), rgba(56,189,248,0.08)) !important;
          border-bottom: 1px solid rgba(34,211,238,0.25) !important;
        }
        thead th {
          color: #22d3ee !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.6px !important;
          padding: 12px 14px !important;
          white-space: nowrap !important;
        }
        thead th span, thead th div { white-space: nowrap !important; display: inline-block; }
        tbody tr {
          border-bottom: 1px solid rgba(34,211,238,0.07) !important;
          transition: background 0.2s ease !important;
        }
        tbody tr:hover { background: rgba(34,211,238,0.05) !important; }
        tbody tr:nth-child(even) { background: rgba(34,211,238,0.03) !important; }
        tbody tr:nth-child(even):hover { background: rgba(34,211,238,0.07) !important; }
        tbody td { color: #cffafe !important; font-size: 13px !important; padding: 11px 14px !important; }
      `}</style>
    </div>
  );
};

export default Downline;