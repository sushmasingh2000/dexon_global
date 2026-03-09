import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CustomToPagination = ({ setPage, page, data }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;

  return (
    <div className="relative w-full flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-3 mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#060d1a] via-[#080f1e] to-[#060a14] border border-blue-400/20 shadow-lg shadow-blue-900/20 overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"></div>

      {/* Page Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-sm">

        {/* Total Pages Badge */}
        <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-400/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-gray-400 font-medium tracking-wide text-xs uppercase">Total Pages</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 font-bold text-sm">
            {totalPages}
          </span>
        </div>

        {/* Current Page Badge */}
        <div className="flex items-center gap-2 bg-yellow-950/20 border border-yellow-400/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
          <span className="text-gray-400 font-medium tracking-wide text-xs uppercase">Current</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 font-bold text-sm">
            {currentPage}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="relative z-10 flex items-center gap-2">

        {/* Prev Button */}
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className={`relative w-9 h-9 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 group/btn
            ${page <= 1
              ? "border-gray-700/40 bg-gray-800/20 cursor-not-allowed opacity-40"
              : "border-cyan-400/30 bg-cyan-950/30 hover:border-cyan-400/60 hover:bg-cyan-900/40 hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/20 cursor-pointer"
            }`}
        >
          {/* Glow on hover */}
          {page > 1 && (
            <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full"></div>
          )}
          {/* Shine sweep */}
          {page > 1 && (
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
            </div>
          )}
          <ChevronLeftIcon
            className={`text-sm transition-transform duration-200 ${page > 1 ? "text-cyan-400 group-hover/btn:scale-110" : "text-gray-600"}`}
            style={{ fontSize: "18px" }}
          />
        </button>

        {/* Page number display */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-blue-400/20">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-bold text-sm tabular-nums">
            {currentPage}
          </span>
          <span className="text-gray-600 text-xs">/</span>
          <span className="text-gray-400 text-sm tabular-nums">{totalPages}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`relative w-9 h-9 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 group/btn
            ${page >= totalPages
              ? "border-gray-700/40 bg-gray-800/20 cursor-not-allowed opacity-40"
              : "border-cyan-400/30 bg-cyan-950/30 hover:border-cyan-400/60 hover:bg-cyan-900/40 hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/20 cursor-pointer"
            }`}
        >
          {page < totalPages && (
            <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full"></div>
          )}
          {page < totalPages && (
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500"></div>
            </div>
          )}
          <ChevronRightIcon
            className={`transition-transform duration-200 ${page < totalPages ? "text-cyan-400 group-hover/btn:scale-110" : "text-gray-600"}`}
            style={{ fontSize: "18px" }}
          />
        </button>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-400/15 rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-400/10 rounded-bl-xl pointer-events-none"></div>

    </div>
  );
};

export default CustomToPagination;