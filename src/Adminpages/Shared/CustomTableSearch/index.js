const CustomTableSearch = ({ fk, onClearFn, onSubmitFn }) => {

    return (
        <div
            className="rounded-xl mb-6 p-4"
            style={{
                background: 'linear-gradient(135deg, rgba(10,18,25,0.95) 0%, rgba(13,24,33,0.90) 100%)',
                border: '1px solid rgba(34,211,238,0.12)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
        >
            {/* Top accent shimmer */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none rounded-t-xl" />

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full">

                {/* ── Date: From ── */}
                <div className="relative group w-full sm:w-auto">
                    <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1 rounded"
                        style={{ color: 'rgba(34,211,238,0.6)', background: 'rgba(10,18,25,1)', zIndex: 1 }}>
                        From
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        id="start_date"
                        value={fk.values.start_date}
                        onChange={fk.handleChange}
                        className="w-full sm:w-auto rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
                        style={{
                            background: 'rgba(34,211,238,0.04)',
                            border: '1px solid rgba(34,211,238,0.14)',
                            color: 'rgba(224,242,254,0.85)',
                            colorScheme: 'dark',
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.08)';
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Separator arrow */}
                <svg className="w-4 h-4 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: 'rgba(34,211,238,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>

                {/* ── Date: To ── */}
                <div className="relative group w-full sm:w-auto">
                    <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1 rounded"
                        style={{ color: 'rgba(34,211,238,0.6)', background: 'rgba(10,18,25,1)', zIndex: 1 }}>
                        To
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        id="end_date"
                        value={fk.values.end_date}
                        onChange={fk.handleChange}
                        className="w-full sm:w-auto rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
                        style={{
                            background: 'rgba(34,211,238,0.04)',
                            border: '1px solid rgba(34,211,238,0.14)',
                            color: 'rgba(224,242,254,0.85)',
                            colorScheme: 'dark',
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.08)';
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 flex-shrink-0" style={{ background: 'rgba(34,211,238,0.1)' }} />

                {/* ── Search Input ── */}
                <div className="relative group flex-1 min-w-[160px] w-full sm:w-auto">
                    <label className="absolute -top-2 left-3 text-[9px] font-bold tracking-widest uppercase px-1 rounded"
                        style={{ color: 'rgba(34,211,238,0.6)', background: 'rgba(10,18,25,1)', zIndex: 1 }}>
                        Search...
                    </label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ color: 'rgba(34,211,238,0.35)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={fk.values.search}
                            onChange={fk.handleChange}
                            placeholder="Search…"
                            className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-600"
                            style={{
                                background: 'rgba(34,211,238,0.04)',
                                border: '1px solid rgba(34,211,238,0.14)',
                                color: 'rgba(224,242,254,0.85)',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = 'rgba(34,211,238,0.4)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.08)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = 'rgba(34,211,238,0.14)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">

                    {/* Search button */}
                    <button
                        onClick={() => {
                            if (onSubmitFn) {
                                onSubmitFn();
                            }
                        }
                        }
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 flex-1 sm:flex-none justify-center relative overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(14,116,144,0.15) 100%)',
                            border: '1px solid rgba(34,211,238,0.3)',
                            color: 'rgba(34,211,238,0.9)',
                            boxShadow: '0 0 12px rgba(34,211,238,0.08)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(14,116,144,0.22) 100%)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.2)';
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(14,116,144,0.15) 100%)';
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(34,211,238,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
                        }}
                    >
                        {/* Shine sweep */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-lg pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </div>
                        <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="relative z-10">Search</span>
                    </button>

                    {/* Clear button */}
                    <button
                        onClick={() => {
                            if (onClearFn) {
                                onClearFn();
                            }
                            fk.handleReset();
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 flex-1 sm:flex-none justify-center"
                        style={{
                            background: 'rgba(34,211,238,0.03)',
                            border: '1px solid rgba(34,211,238,0.1)',
                            color: 'rgba(148,163,184,0.7)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
                            e.currentTarget.style.color = 'rgba(252,165,165,0.85)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(34,211,238,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)';
                            e.currentTarget.style.color = 'rgba(148,163,184,0.7)';
                        }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CustomTableSearch;
