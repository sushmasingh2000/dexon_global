import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./assets/favicon.png";
import logo1 from "./assets/logo.png";

const NAV_LINKS = ['Markets', 'Trading', 'Analytics', 'Academy', 'About'];

const STATS = [
    { value: '$4.2T', label: 'Daily Volume', suffix: '' },
    { value: '180+', label: 'Currency Pairs', suffix: '' },
    { value: '0.01ms', label: 'Execution Speed', suffix: '' },
    { value: '99.97%', label: 'Uptime SLA', suffix: '' },
];

const MARKETS = [
    { pair: 'EUR/USD', price: '1.08542', change: '+0.12%', up: true, volume: '84.2B' },
    { pair: 'GBP/JPY', price: '191.340', change: '-0.08%', up: false, volume: '32.1B' },
    { pair: 'BTC/USD', price: '67,420.50', change: '+2.34%', up: true, volume: '12.8B' },
    { pair: 'ETH/USD', price: '3,521.80', change: '+1.87%', up: true, volume: '8.4B' },
    { pair: 'XAU/USD', price: '2,318.40', change: '-0.21%', up: false, volume: '41.2B' },
    { pair: 'SOL/USD', price: '142.65', change: '+4.12%', up: true, volume: '2.1B' },
    { pair: 'USD/JPY', price: '154.820', change: '+0.33%', up: true, volume: '55.6B' },
    { pair: 'ADA/USD', price: '0.4521', change: '-1.43%', up: false, volume: '0.9B' },
];

const FEATURES = [
    {
        icon: '⚡',
        title: 'Ultra-Low Latency',
        desc: 'Sub-millisecond order execution with co-located servers across 12 global data centers.',
    },
    {
        icon: '🔒',
        title: 'Institutional Security',
        desc: 'Cold storage, multi-sig wallets, and 256-bit AES encryption protect every asset.',
    },
    {
        icon: '📊',
        title: 'Advanced Charting',
        desc: 'TradingView-powered charts with 100+ indicators and custom algorithmic overlays.',
    },
    {
        icon: '🤖',
        title: 'AI Signal Engine',
        desc: 'Machine learning models trained on 20 years of market data surface high-probability setups.',
    },
    {
        icon: '🌐',
        title: 'Deep Liquidity',
        desc: 'Access to tier-1 bank liquidity and 50+ crypto exchanges via our unified order book.',
    },
    {
        icon: '📱',
        title: 'Cross-Platform',
        desc: 'Seamless trading on web, iOS, Android, and desktop with real-time sync.',
    },
];

const CANDLE_DATA = [
    { o: 60, h: 80, l: 50, c: 75 },
    { o: 75, h: 90, l: 65, c: 68 },
    { o: 68, h: 85, l: 60, c: 82 },
    { o: 82, h: 95, l: 75, c: 88 },
    { o: 88, h: 100, l: 80, c: 72 },
    { o: 72, h: 85, l: 55, c: 78 },
    { o: 78, h: 92, l: 70, c: 90 },
    { o: 90, h: 105, l: 82, c: 98 },
    { o: 98, h: 110, l: 88, c: 85 },
    { o: 85, h: 95, l: 70, c: 92 },
    { o: 92, h: 108, l: 84, c: 102 },
    { o: 102, h: 115, l: 94, c: 108 },
];

function MiniChart({ up }) {
    const points = up
        ? [40, 35, 45, 30, 42, 28, 38, 20, 32, 15, 25, 10]
        : [10, 15, 8, 20, 12, 25, 18, 30, 22, 35, 28, 40];
    const w = 80, h = 30;
    const min = Math.min(...points), max = Math.max(...points);
    const coords = points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - ((p - min) / (max - min)) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={`g${up}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={up ? '#00BCD4' : '#ff4466'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={up ? '#00BCD4' : '#ff4466'} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={coords}
                fill="none"
                stroke={up ? '#00BCD4' : '#ff4466'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CandleChart() {
    return (
        <svg width="100%" height="120" viewBox="0 0 240 120" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#00BCD4" stopOpacity="0" />
                </linearGradient>
            </defs>
            {CANDLE_DATA.map((c, i) => {
                const x = 10 + i * 20;
                const up = c.c > c.o;
                const color = up ? '#00BCD4' : '#ff4466';
                const bodyTop = Math.min(c.o, c.c);
                const bodyBot = Math.max(c.o, c.c);
                return (
                    <g key={i}>
                        <line x1={x} y1={c.h} x2={x} y2={c.l} stroke={color} strokeWidth="1" opacity="0.6" />
                        <rect
                            x={x - 4}
                            y={bodyTop}
                            width={8}
                            height={Math.max(bodyBot - bodyTop, 2)}
                            fill={up ? color : 'transparent'}
                            stroke={color}
                            strokeWidth="1"
                            rx="1"
                            opacity="0.9"
                        />
                    </g>
                );
            })}
        </svg>
    );
}

function Ticker() {
    const items = [...MARKETS, ...MARKETS];
    return (
        <div style={{
            background: 'rgba(0,188,212,0.05)',
            borderTop: '1px solid rgba(0,188,212,0.15)',
            borderBottom: '1px solid rgba(0,188,212,0.15)',
            overflow: 'hidden',
            padding: '10px 0',
        }}>
            <div style={{
                display: 'flex',
                gap: '48px',
                animation: 'ticker 30s linear infinite',
                whiteSpace: 'nowrap',
            }}>
                {items.map((m, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontFamily: '"IBM Plex Mono", monospace' }}>
                        <span style={{ color: '#888' }}>{m.pair}</span>
                        <span style={{ color: '#fff' }}>{m.price}</span>
                        <span style={{ color: m.up ? '#00BCD4' : '#ff4466' }}>{m.change}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

function CountUp({ target, duration = 2000 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(eased * num);
            if (progress < 1) ref.current = requestAnimationFrame(tick);
        };
        ref.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(ref.current);
    }, []);
    const prefix = target.match(/^[^0-9]*/)[0];
    const suffix = target.match(/[^0-9.]*$/)[0];
    const decimals = (target.match(/\.(\d+)/) || ['', ''])[1].length;
    return <>{prefix}{val.toFixed(decimals)}{suffix}</>;
}

const Website = () => {
    const [scrollY, setScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('forex');
    const heroRef = useRef(null);

    const navigate = useNavigate()
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const forexMarkets = MARKETS.filter((_, i) => [0, 1, 4, 6].includes(i));
    const cryptoMarkets = MARKETS.filter((_, i) => [2, 3, 5, 7].includes(i));
    const displayMarkets = activeTab === 'forex' ? forexMarkets : cryptoMarkets;

    return (
        <div style={{
            background: '#060a0f',
            color: '#e8eaf0',
            fontFamily: '"DM Sans", sans-serif',
            minHeight: '100vh',
            overflowX: 'hidden',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,700;1,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glitch {
          0%, 100% { clip-path: inset(0 0 100% 0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translateX(-2px); }
          40% { clip-path: inset(60% 0 20% 0); transform: translateX(2px); }
          60% { clip-path: inset(40% 0 40% 0); transform: translateX(-1px); }
          80% { clip-path: inset(10% 0 80% 0); transform: translateX(1px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }

        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.4s ease both; }

        .nav-link {
          color: #888;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { color: #fff; }

        .btn-primary {
     background: linear-gradient(135deg, #f5990c, #f97815);
          color: #060a0f;
          border: none;
          padding: 12px 28px;
          border-radius: 4px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.2);
          transform: translateX(-100%);
          transition: transform 0.3s;
        }
        .btn-primary:hover::after { transform: translateX(0); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,188,212,0.4); }

        .btn-secondary {
          background: transparent;
          color: #e8eaf0;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 28px;
          border-radius: 4px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
        }

        .market-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 80px 1fr;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
          cursor: pointer;
        }
        .market-row:hover { background: rgba(0,188,212,0.03); }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 32px;
          transition: all 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: rgba(0,188,212,0.3);
          background: rgba(0,188,212,0.04);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .tab-btn {
          background: none;
          border: none;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 8px 20px;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .scroll-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060a0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

            {/* GRID BACKGROUND */}
            <div style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                backgroundImage: `
          linear-gradient(rgba(0,188,212,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,188,212,0.04) 1px, transparent 1px)
        `,
                backgroundSize: '40px 40px',
                backgroundPosition: `0 ${scrollY * 0.1}px`,
                transition: 'background-position 0.1s',
            }} />

            {/* RADIAL GLOW */}
            <div style={{
                position: 'fixed',
                top: '-20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '800px',
                height: '600px',
                background: 'radial-gradient(ellipse, rgba(0,188,212,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            {/* NAV */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '0 5%',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: scrollY > 40 ? 'rgba(6,10,15,0.95)' : 'transparent',
                backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
                borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                transition: 'all 0.3s',
            }}>
                {/* LOGO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 900, color: '#060a0f',
                    }}>
                        <img src={logo1} />
                    </div>
                    <span style={{
                        width: '150px',
                    }}>
                        <img src={logo} />
                    </span>
                </div>

                {/* LINKS */}
                <div style={{ display: window.innerWidth < 768 ? 'none' : 'flex', gap: '36px', alignItems: 'center' }}>
                    {NAV_LINKS.map(l => (
                        <span key={l} className="nav-link">{l}</span>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}
                        onClick={() => navigate("/login")}
                    >Log In</button>
                    {window.innerWidth >= 768 && (
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 20px', fontSize: '13px' }}
                            onClick={() => navigate("/register")}
                        >
                            Start Trading
                        </button>
                    )}

                </div>
            </nav>

            {/* TICKER */}
            <div style={{ position: 'relative', zIndex: 10, marginTop: '64px' }}>
                <Ticker />
            </div>

            {/* HERO */}
            <section ref={heroRef} style={{
                position: 'relative',
                zIndex: 1,
                minHeight: '90vh',
                display: 'flex',
                flexDirection: window.innerWidth < 900 ? 'column' : 'row',
                alignItems: 'center',
                padding: '80px 5% 60px',
                gap: '60px',
            }}>
                <div style={{
                    flex: 1,
                    maxWidth: window.innerWidth < 900 ? '100%' : '620px'
                }}>
                    <div className="fade-up-1" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0,188,212,0.08)',
                        border: '1px solid rgba(0,188,212,0.2)',
                        borderRadius: '100px',
                        padding: '6px 16px',
                        marginBottom: '32px',
                    }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00BCD4', animation: 'pulse-ring 2s infinite' }} />
                        <span style={{ fontSize: '12px', color: '#00BCD4', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.08em' }}>MARKETS OPEN · 24/7 LIVE TRADING</span>
                    </div>

                    <h1 className="fade-up-2" style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 'clamp(32px, 6vw, 72px)',
                        fontWeight: 700,
                        lineHeight: 1.08,
                        letterSpacing: '-0.03em',
                        marginBottom: '24px',
                    }}>
                        Trade Forex &<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'shimmer 3s linear infinite',
                        }}>
                            Crypto
                        </span>{' '}
                        with<br />
                        <em style={{ fontStyle: 'italic', fontWeight: 500 }}>precision.</em>
                    </h1>

                    <p className="fade-up-3" style={{
                        fontSize: '17px',
                        lineHeight: 1.65,
                        color: '#888',
                        marginBottom: '40px',
                        maxWidth: '460px',
                        fontWeight: 300,
                    }}>
                        Institutional-grade execution on 180+ Forex pairs and 300+ crypto assets. Deep liquidity, razor-thin spreads, and AI-powered signals — built for the serious trader.
                    </p>

                    <div className="fade-up-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <button className="btn-primary"
                            onClick={() => navigate("/register")}
                        >Open Free Account</button>
                        <button className="btn-secondary"
                            onClick={() => window.open("https://in.tradingview.com/", "_blank")}
                        >View Live Markets →</button>
                    </div>

                    <div className="fade-up-4" style={{
                        display: 'flex',
                        gap: '32px',
                        marginTop: '48px',
                        paddingTop: '32px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        {[
                            { v: '2M+', l: 'Active Traders' },
                            { v: '$280B', l: 'Monthly Volume' },
                            { v: '0.0 pip', l: 'Raw Spread' },
                        ].map(({ v, l }) => (
                            <div key={l}>
                                <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"IBM Plex Mono", monospace', color: '#f5990c' }}>{v}</div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', letterSpacing: '0.04em' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HERO CHART CARD */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div className="fade-up-2" style={{
                        background: 'rgba(10,16,24,0.9)',
                        border: '1px solid rgba(0,188,212,0.15)',
                        borderRadius: '16px',
                        padding: '28px',
                        width: '100%',
                        maxWidth: '480px',
                        animation: 'float 6s ease-in-out infinite',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(0,188,212,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* scanline effect */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(transparent, rgba(0,188,212,0.3), transparent)',
                            animation: 'scanline 4s linear infinite',
                            pointerEvents: 'none',
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: '13px', color: '#555', fontFamily: '"IBM Plex Mono", monospace', marginBottom: '4px' }}>BTC / USD</div>
                                <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '-0.03em' }}>67,420<span style={{ fontSize: '18px', color: '#666' }}>.50</span></div>
                                <div style={{ fontSize: '13px', color: '#00BCD4', marginTop: '4px', fontFamily: '"IBM Plex Mono", monospace' }}>▲ 2.34% · +$1,543.20</div>
                            </div>
                            <div style={{
                                background: 'rgba(0,188,212,0.1)',
                                border: '1px solid rgba(0,188,212,0.25)',
                                borderRadius: '6px',
                                padding: '8px 14px',
                                fontSize: '11px',
                                color: '#00BCD4',
                                fontFamily: '"IBM Plex Mono", monospace',
                                letterSpacing: '0.06em',
                            }}>● LIVE</div>
                        </div>

                        <CandleChart />

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '12px',
                            marginTop: '20px',
                        }}>
                            {[
                                { l: '24H High', v: '68,920' },
                                { l: '24H Low', v: '65,100' },
                                { l: 'Volume', v: '12.8B' },
                            ].map(({ l, v }) => (
                                <div key={l} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '10px', color: '#555', marginBottom: '4px', letterSpacing: '0.06em' }}>{l}</div>
                                    <div style={{ fontSize: '13px', fontFamily: '"IBM Plex Mono", monospace', color: '#ddd' }}>{v}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #f5990c, #f97815)',
                                color: '#060a0f',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '12px',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontFamily: '"DM Sans", sans-serif',
                                letterSpacing: '0.04em',
                            }}>BUY LONG</button>
                            <button style={{
                                flex: 1,
                                background: 'rgba(255,68,102,0.15)',
                                color: '#ff4466',
                                border: '1px solid rgba(255,68,102,0.3)',
                                borderRadius: '6px',
                                padding: '12px',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontFamily: '"DM Sans", sans-serif',
                                letterSpacing: '0.04em',
                            }}>SELL SHORT</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                margin: '0 5%',
                borderRadius: '12px',
                background: 'rgba(0,188,212,0.04)',
                border: '1px solid rgba(0,188,212,0.12)',
                padding: '32px 48px',
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '100px',
            }}>
                {STATS.map(({ value, label }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: 'clamp(24px, 3vw, 38px)',
                            fontWeight: 500,
                            color: '#f5990c',
                            marginBottom: '6px',
                        }}>{value}</div>
                        <div style={{ fontSize: '13px', color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* MARKETS TABLE */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"IBM Plex Mono", monospace' }}>Live Markets</p>
                            <h2 style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: 'clamp(28px, 3vw, 44px)',
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                            }}>Real-Time Prices</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '4px' }}>
                            {['forex', 'crypto'].map(tab => (
                                <button
                                    key={tab}
                                    className="tab-btn"
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        color: activeTab === tab ? '#060a0f' : '#666',
                                        background: activeTab === tab ? '#f5990c' : 'transparent',
                                    }}
                                >{tab}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(10,16,24,0.8)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)',
                        overflowX: 'auto',
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 80px 1fr',
                            padding: '12px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            fontSize: '11px',
                            color: '#444',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontFamily: '"IBM Plex Mono", monospace',
                        }}>
                            <span>Pair</span>
                            <span>Price</span>
                            <span>24H Change</span>
                            <span>Chart</span>
                            <span>Volume</span>
                        </div>

                        {displayMarkets.map((m, i) => (
                            <div key={m.pair} className="market-row">
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.pair}</span>
                                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px' }}>{m.price}</span>
                                <span style={{
                                    color: m.up ? '#00BCD4' : '#ff4466',
                                    fontFamily: '"IBM Plex Mono", monospace',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    {m.up ? '▲' : '▼'} {m.change}
                                </span>
                                <span><MiniChart up={m.up} /></span>
                                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: '#666' }}>${m.volume}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ fontSize: '12px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>Why Dexon Global</p>
                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 'clamp(28px, 3vw, 48px)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        The Edge That{' '}
                        <em style={{ fontStyle: 'italic', color: '#f5990c' }}>Separates</em>{' '}
                        Winners
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                }}>
                    {FEATURES.map((f, i) => (
                        <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.65 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA BANNER */}
            <section style={{
                position: 'relative',
                zIndex: 1,
                margin: '0 5% 100px',
                borderRadius: '16px',
                overflow: 'hidden',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(0,188,212,0.12), rgba(128,222,234,0.06))',
                    border: '1px solid rgba(0,188,212,0.2)',
                    borderRadius: '16px',
                    padding: '80px 60px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px',
                        height: '400px',
                        background: 'radial-gradient(ellipse, rgba(0,188,212,0.12), transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <p style={{ fontSize: '12px', color: '#00BCD4', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace', marginBottom: '20px' }}>
                        Start in 60 seconds
                    </p>
                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 'clamp(28px, 4vw, 56px)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        marginBottom: '20px',
                        maxWidth: '700px',
                        margin: '0 auto 20px',
                    }}>
                        Your next trade is<br />
                        <em style={{ color: '#f5990c', fontStyle: 'italic' }}>one click away.</em>
                    </h2>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', maxWidth: '460px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                        No minimums. No hidden fees. Just pure market access for every level of trader.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 36px' }} onClick={() => navigate("/register")}>Create Free Account</button>
                        <button className="btn-secondary" style={{ fontSize: '15px', padding: '14px 36px' }} onClick={() => navigate("/register")}>Try Demo Trading</button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#444', marginTop: '24px', fontFamily: '"IBM Plex Mono", monospace' }}>
                        Risk disclosure: Trading involves significant risk. Past performance ≠ future results.
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{
                position: 'relative',
                zIndex: 1,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '60px 5% 40px',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '2fr 1fr 1fr 1fr',
                    gap: '48px',
                    marginBottom: '60px',
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 900, color: '#060a0f',
                    }}>
                        <img src={logo1} />
                    </div>
                            <span style={{
                        width: '150px',
                    }}>
                        <img src={logo} />
                    </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, maxWidth: '260px' }}>
                            Institutional-grade trading infrastructure for the modern market participant.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            {['𝕏', 'in', 'f', 'tg'].map(s => (
                                <div key={s} style={{
                                    width: '34px', height: '34px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    color: '#555',
                                    transition: 'all 0.2s',
                                }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: 'Products', links: ['Forex Trading', 'Crypto Trading', 'MetaTrader 5', 'Mobile App', 'API Access'] },
                        { title: 'Markets', links: ['Major Pairs', 'Minor Pairs', 'Bitcoin', 'Altcoins', 'Commodities'] },
                        { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Regulators', 'Contact'] },
                    ].map(({ title, links }) => (
                        <div key={title}>
                            <h4 style={{ fontSize: '12px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace', marginBottom: '20px' }}>{title}</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {links.map(l => (
                                    <li key={l} style={{ fontSize: '14px', color: '#555', cursor: 'pointer', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#ddd'}
                                        onMouseLeave={e => e.target.style.color = '#555'}
                                    >{l}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <p style={{ fontSize: '12px', color: '#444', fontFamily: '"IBM Plex Mono", monospace' }}>
                        © 2025 Dexon Global Ltd. All rights reserved. Regulated by FCA (UK) · ASIC (AU)
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Risk Disclosure'].map(l => (
                            <span key={l} style={{ fontSize: '12px', color: '#444', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#888'}
                                onMouseLeave={e => e.target.style.color = '#444'}
                            >{l}</span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Website;