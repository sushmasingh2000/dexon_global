import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";

const Level = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  const fk = useFormik({
    initialValues: { search: "", count: 10, start_date: "", end_date: "" },
    enableReinitialize: true,
  });

  const { data, isLoading } = useQuery(
    ["get_level_income", fk.values.search, fk.values.start_date, fk.values.end_date, page],
    () =>
      apiConnectorPost(endpoint?.get_report_details, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page,
        count: fk.values.count,
        sub_label: "LEVEL",
        main_label: "IN",
      }),
    { keepPreviousData: true, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false }
  );

  const allData = data?.data?.result || [];

  const tablehead = [
    <span>S.No.</span>,
    <span>Transaction</span>,
    <span>Date</span>,
    <span>Amount ($)</span>,
    <span>Level</span>,
    <span>Description</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => [
    <span>{(page - 1) * (fk.values.count || 10) + index + 1}</span>,
    <span>{row.tr07_trans_id}</span>,
    <span>{formatedDate(moment, row.tr07_created_at)}</span>,
    <span>{getFloatingValue(row.tr07_tr_amount)}</span>,
    <span>{row.tr07_help_lev || "--"}</span>,
    <span>{row.tr07_description || "N/A"}</span>,
  ]);

  return (
    <div className="p-4 " style={{ background: "linear-gradient(135deg, #060d1a 0%, #080f1e 50%, #060a14 100%)" }}>
      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 tracking-wide">
            Community Level Income
          </h2>
        </div>
        <div className="ml-4 h-px bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
      </div>

      {/* Filters */}
      <div className="relative rounded-xl p-4 mb-5 border border-cyan-400/20 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(6,13,26,0.9) 0%, rgba(8,15,30,0.9) 100%)" }}>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-xl pointer-events-none"></div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">From Date</label>
            <input type="date" name="start_date" value={fk.values.start_date} onChange={fk.handleChange}
              className="px-3 py-2 rounded-lg border border-cyan-400/20 text-gray-200 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
              style={{ background: "rgba(6,13,26,0.8)" }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">To Date</label>
            <input type="date" name="end_date" value={fk.values.end_date} onChange={fk.handleChange}
              className="px-3 py-2 rounded-lg border border-cyan-400/20 text-gray-200 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
              style={{ background: "rgba(6,13,26,0.8)" }} />
          </div>
          <button onClick={() => { setPage(1); client.invalidateQueries(["get_level_income"]); }}
            className="self-end relative px-5 py-2 rounded-lg font-semibold text-sm text-white overflow-hidden group border border-cyan-400/30 transition-all duration-200 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-sky-600 to-cyan-700"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-lg pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            </div>
            <span className="relative z-10">Search</span>
          </button>
          <button onClick={() => { fk.handleReset(); setPage(1); }}
            className="self-end px-5 py-2 rounded-lg border border-cyan-400/20 text-gray-400 text-sm font-semibold hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-200"
            style={{ background: "rgba(34,211,238,0.04)" }}>
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative rounded-xl border border-cyan-400/20 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(6,13,26,0.95) 0%, rgba(8,15,30,0.95) 100%)" }}>
        <div className="h-0.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-400/10 rounded-tr-xl pointer-events-none"></div>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-400/10">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">Community Level Income Records</span>
        </div>
        <div className="px-2 py-3">
          <CustomTable tablehead={tablehead} tablerow={tablerow} isLoading={isLoading} />
        </div>
        <div className="border-t border-cyan-400/10 px-4 py-3">
          <CustomToPagination page={page} setPage={setPage} data={allData} />
        </div>
      </div>

      <style>{`
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead tr { background: linear-gradient(90deg, rgba(34,211,238,0.12), rgba(56,189,248,0.08)) !important; border-bottom: 1px solid rgba(34,211,238,0.25) !important; }
        thead th { color: #22d3ee !important; font-size: 12px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.6px !important; padding: 12px 14px !important; white-space: nowrap !important; }
        thead th span, thead th div { white-space: nowrap !important; display: inline-block; }
        tbody tr { border-bottom: 1px solid rgba(34,211,238,0.07) !important; transition: background 0.2s ease !important; }
        tbody tr:hover { background: rgba(34,211,238,0.05) !important; }
        tbody tr:nth-child(even) { background: rgba(34,211,238,0.03) !important; }
        tbody tr:nth-child(even):hover { background: rgba(34,211,238,0.07) !important; }
        tbody td { color: #cffafe !important; font-size: 13px !important; padding: 11px 14px !important; }
      `}</style>
    </div>
  );
};

export default Level;