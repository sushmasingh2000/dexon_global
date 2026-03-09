import { Skeleton } from "@mui/material";

const CustomTable = ({
  tablehead = [],   // default empty array
  tablerow = [],    // default empty array
  className,
  isLoading,
}) => {
  // Drop-in replacement for your reusable table return block

  // Drop-in replacement for your reusable table return block

  return (
    <div className={`w-full ${className || ""}`} style={{ overflowX: 'auto !important', WebkitOverflowScrolling: 'touch' }}>
      <div
        className="rounded-xl"
        style={{
          border: '1px solid rgba(34,211,238,0.12)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
          minWidth: '700px',
        }}
      >
        <table className="w-full table-auto text-sm" style={{ minWidth: '700px' }}>

          {/* ─── THEAD ─── */}
          <thead>
            <tr
              style={{
                background: 'linear-gradient(90deg, rgba(6,13,20,0.98) 0%, rgba(10,18,25,0.95) 100%)',
                borderBottom: '1px solid rgba(34,211,238,0.18)',
              }}
            >
              {Array.isArray(tablehead) &&
                tablehead.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-5 py-3.5 text-left whitespace-nowrap"
                    style={{ borderRight: '1px solid rgba(34,211,238,0.06)' }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Column accent dot */}
                      <div className="w-1 h-1 rounded-full bg-cyan-400/50 flex-shrink-0" />
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: 'rgba(34,211,238,0.65)' }}
                      >
                        {column}
                      </span>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          {/* ─── TBODY ─── */}
          <tbody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: rowIndex % 2 === 0
                      ? 'rgba(10,18,25,0.85)'
                      : 'rgba(8,15,21,0.85)',
                    borderBottom: '1px solid rgba(34,211,238,0.05)',
                  }}
                >
                  {Array.isArray(tablehead) &&
                    tablehead.map((_, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-3.5" style={{ borderRight: '1px solid rgba(34,211,238,0.04)' }}>
                        <div
                          className="h-3 rounded-full animate-pulse"
                          style={{
                            width: `${Math.random() * 40 + 40}%`,
                            background: 'linear-gradient(90deg, rgba(34,211,238,0.06) 0%, rgba(34,211,238,0.12) 50%, rgba(34,211,238,0.06) 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${cellIndex * 100}ms`,
                          }}
                        />
                      </td>
                    ))}
                </tr>
              ))
            ) : tablerow.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={tablehead?.length || 1}
                  className="px-5 py-16 text-center"
                  style={{ background: 'rgba(10,18,25,0.9)' }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'rgba(34,211,238,0.05)',
                        border: '1px solid rgba(34,211,238,0.12)',
                      }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(34,211,238,0.3)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No data found</p>
                    <p className="text-gray-700 text-xs">Records will appear here once available</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              tablerow.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-all duration-150 cursor-pointer"
                  style={{
                    background: rowIndex % 2 === 0
                      ? 'rgba(10,18,25,0.85)'
                      : 'rgba(8,15,21,0.85)',
                    borderBottom: '1px solid rgba(34,211,238,0.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(34,211,238,0.05)';
                    e.currentTarget.style.borderBottom = '1px solid rgba(34,211,238,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = rowIndex % 2 === 0
                      ? 'rgba(10,18,25,0.85)'
                      : 'rgba(8,15,21,0.85)';
                    e.currentTarget.style.borderBottom = '1px solid rgba(34,211,238,0.05)';
                  }}
                >
                  {Array.isArray(row) &&
                    row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-5 py-3.5 whitespace-nowrap text-sm"
                        style={{
                          color: cellIndex === 0 ? 'rgba(224,242,254,0.9)' : 'rgba(148,163,184,0.85)',
                          borderRight: '1px solid rgba(34,211,238,0.04)',
                          fontWeight: cellIndex === 0 ? 500 : 400,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Row count footer */}
      {!isLoading && tablerow.length > 0 && (
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
            <span className="text-[10px] text-gray-600 tracking-widest uppercase">
              {tablerow.length} record{tablerow.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
          <span className="text-[10px] text-gray-700 tracking-wide">
            {tablehead?.length} col{tablehead?.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
    </div>
  );
};

export default CustomTable;
