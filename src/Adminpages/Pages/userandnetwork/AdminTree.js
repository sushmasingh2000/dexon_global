import { Menu, MenuItem } from '@mui/material';
import moment from 'moment/moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { FaUser } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { apiConnectorGetAdmin } from '../../../utils/APIConnector';
import { endpoint } from '../../../utils/APIRoutes';

// ── Tree Loader ───────────────────────────────────────────────────────────────
const TreeLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4"
    style={{ background: '#060d1a' }}>
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-400/10"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
        style={{ animation: 'spin 1s linear infinite' }}></div>
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Building Tree</p>
      <p className="text-gray-500 text-xs">Fetching network data...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Map one raw API row → node ────────────────────────────────────────────────
// mem_id   = lgn_cust_id  (string, used for parent-child linking via from_cust)
// reg_id   = member_reg_id (integer lgn_jnr_id, used for API calls)
//            ⚠️ Requires backend to SELECT l.lgn_jnr_id AS member_reg_id
const rowToNode = (item, lazyLoaded = false, levelOffset = 0) => ({
  name:         item.lgn_name        || 'Unknown',
  mem_id:       item.lgn_cust_id     || '',           // string linking key
  reg_id:       item.member_reg_id   ? Number(item.member_reg_id) : null, // integer for API
  _userId:      item.lgn_cust_id     || '',
  _joiningDate: item.tr03_reg_date   || '',
  _topupDate:   item.tr03_topup_date || '0',
  _email:       item.lgn_email       || '',
  _mobile:      item.lgn_mobile      || '',
  _sponsor:     item.from_cust       || '',
  _level:       item.level_id != null ? Number(item.level_id) + levelOffset : '--',
  _lazyLoaded:  lazyLoaded,
  _loading:     false,
  children:     [],
});

// ── Build flat list → tree ────────────────────────────────────────────────────
const buildTreeFromFlatData = (items, levelOffset = 0) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const map = {};
  items.forEach((item) => {
    const id = item.lgn_cust_id;
    if (!id) return;
    map[id] = rowToNode(item, false, levelOffset);
  });

  const parentSet = new Set();
  const childSet  = new Set();

  items.forEach((item) => {
    const node = map[item.lgn_cust_id];
    if (!node) return;
    if (item.from_cust && map[item.from_cust]) {
      map[item.from_cust].children.push(node);
      childSet.add(node.mem_id);
      parentSet.add(item.from_cust);
    }
  });

  // Nodes with children already in response → _lazyLoaded=true → no + shown
  parentSet.forEach((id) => {
    if (map[id]) map[id]._lazyLoaded = true;
  });

  const roots = Object.values(map).filter((node) => !childSet.has(node.mem_id));
  if (roots.length === 1) return roots[0];
  if (roots.length > 1) {
    return {
      name: 'Team', mem_id: '__root__', reg_id: null,
      _userId: '--', _joiningDate: '', _topupDate: '0',
      _email: '', _mobile: '', _sponsor: '', _level: '--',
      _lazyLoaded: true, _loading: false, children: roots,
    };
  }
  return null;
};

// ── Immutable tree helpers ────────────────────────────────────────────────────
const mergeChildren = (node, targetId, newChildren) => {
  if (node.mem_id === targetId)
    return { ...node, _lazyLoaded: true, _loading: false, children: newChildren };
  return { ...node, children: node.children.map((c) => mergeChildren(c, targetId, newChildren)) };
};

const setLoadingState = (node, targetId, loading) => {
  if (node.mem_id === targetId) return { ...node, _loading: loading };
  return { ...node, children: node.children.map((c) => setLoadingState(c, targetId, loading)) };
};

const fmtDate = (val) => {
  if (!val || val === '0' || val === 'null' || val === 'undefined') return '--';
  const m = moment(val);
  return m.isValid() ? m.format('DD-MM-YYYY') : String(val);
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminTree = () => {
  const [verticaa]    = useState('vertical');
  const [pathfn]      = useState('diagonal');
  const [anchorEl, setAnchorEl]           = useState(null);
  const [selectedNode, setSelectedNode]   = useState(null);
  const [translate, setTranslate]         = useState({ x: 0, y: 0 });
  const [treeData, setTreeData]           = useState(null);

  const location = useLocation();
  const userId   = location.state.userId;  // integer lgn_jnr_id passed from admin panel

  const open             = Boolean(anchorEl);
  const treeContainerRef = useRef(null);
  const handleClose      = () => setAnchorEl(null);

  const { data, isLoading } = useQuery(
    ['tree-downline-admin', userId],
    () => apiConnectorGetAdmin(endpoint.get_member_downline_tree, { userId }),
    { refetchOnMount: false, refetchOnReconnect: false, retry: false, retryOnMount: false, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const flatData = data?.data?.result || [];
    const built = buildTreeFromFlatData(flatData, 0);
    if (built) setTreeData(built);
  }, [data]);

  useEffect(() => {
    if (treeContainerRef.current) {
      const dim = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: dim.width / 2, y: dim.height / 6 });
    }
  }, [treeData, verticaa]);

  // ── Lazy load on + click ──────────────────────────────────────────────────
  const loadChildren = useCallback(async (nodeDatum) => {
    const { mem_id, reg_id, _level, _lazyLoaded, _loading } = nodeDatum;
    if (mem_id === '__root__' || _lazyLoaded || _loading) return;

    // reg_id = lgn_jnr_id (integer) — required by backend stored proc
    if (!reg_id || isNaN(reg_id)) {
      console.error(
        'Cannot expand: reg_id (lgn_jnr_id) is missing for node', mem_id,
        '— make sure backend SELECTs l.lgn_jnr_id AS member_reg_id'
      );
      return;
    }

    setTreeData((prev) => setLoadingState(prev, mem_id, true));

    const clickedLevel = typeof _level === 'number' ? _level : 0;
    const levelOffset  = clickedLevel;

    try {
      const res = await apiConnectorGetAdmin(endpoint.get_member_downline_tree, {
        userId: reg_id,   // ← integer lgn_jnr_id
      });
      const flatData = res?.data?.result || [];

      const childMap = {};
      flatData.forEach((item) => {
        const id = item.lgn_cust_id;
        if (!id || id === mem_id) return;
        childMap[id] = rowToNode(item, false, levelOffset);
      });

      // Wire nested children + mark sub-parents
      const subParentSet = new Set();
      Object.values(childMap).forEach((node) => {
        if (node._sponsor && childMap[node._sponsor]) {
          childMap[node._sponsor].children.push(node);
          subParentSet.add(node._sponsor);
        }
      });
      subParentSet.forEach((id) => {
        if (childMap[id]) childMap[id]._lazyLoaded = true;
      });

      const directChildren = Object.values(childMap).filter(
        (node) => node._sponsor === mem_id
      );

      setTreeData((prev) => mergeChildren(prev, mem_id, directChildren));
    } catch (e) {
      console.error('Failed to load children:', e);
      setTreeData((prev) => setLoadingState(prev, mem_id, false));
    }
  }, []);

  // ── Node renderer ─────────────────────────────────────────────────────────
  const renderCustomNode = ({ nodeDatum }) => {
    const isActive = nodeDatum._topupDate && nodeDatum._topupDate !== '0';
    const loading  = nodeDatum._loading;
    const loaded   = nodeDatum._lazyLoaded;
    const isRoot   = nodeDatum.mem_id === '__root__';

    const handleNodeClick = (e) => {
      e.stopPropagation();
      setSelectedNode(nodeDatum);
      setAnchorEl(e.currentTarget);
    };

    const handleExpandClick = (e) => {
      e.stopPropagation();
      loadChildren(nodeDatum);
    };

    return (
      <g style={{ cursor: 'pointer' }}>
        <circle r={36} fill="none" stroke={isActive ? 'rgba(34,211,238,0.25)' : 'rgba(239,68,68,0.25)'} strokeWidth={2} style={{ filter: 'blur(2px)' }} />
        <circle r={33} fill="none" stroke={isActive ? 'rgba(34,211,238,0.4)' : 'rgba(239,68,68,0.4)'} strokeWidth={1.5} strokeDasharray="4 3" />
        <circle r={28} fill={isActive ? '#0e2a30' : '#2a0e0e'} stroke={isActive ? '#22d3ee' : '#ef4444'} strokeWidth={2} onClick={handleNodeClick} />
        <circle r={22} fill={isActive ? 'rgba(34,211,238,0.08)' : 'rgba(239,68,68,0.08)'} stroke="none" onClick={handleNodeClick} />

        <foreignObject x={-16} y={-16} width={32} height={32} onClick={handleNodeClick}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(34,211,238,0.2)', borderTop: '2px solid #22d3ee', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <FaUser style={{ fontSize: '18px', color: isActive ? '#22d3ee' : '#ef4444', filter: `drop-shadow(0 0 4px ${isActive ? '#22d3ee' : '#ef4444'})` }} />
            )}
          </div>
        </foreignObject>

        <rect x={-40} y={36} width={80} height={20} rx={6}
          fill={isActive ? 'rgba(14,42,48,0.9)' : 'rgba(42,14,14,0.9)'}
          stroke={isActive ? 'rgba(34,211,238,0.3)' : 'rgba(239,68,68,0.3)'} strokeWidth={1}
          onClick={handleNodeClick} />
        <text x={0} y={51} textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="monospace"
          fill={isActive ? '#67e8f9' : '#fca5a5'} stroke="none"
          style={{ cursor: 'pointer', letterSpacing: '0.5px' }}
          onClick={handleNodeClick}>
          {nodeDatum.name?.length > 10 ? `${nodeDatum.name.slice(0, 10)}...` : nodeDatum.name}
        </text>

        <circle cx={20} cy={-22} r={5} fill={isActive ? '#22c55e' : '#ef4444'} stroke={isActive ? '#14532d' : '#7f1d1d'} strokeWidth={1.5} onClick={handleNodeClick} />

        {/* + expand button */}
        {!loaded && !loading && !isRoot && (
          <g onClick={handleExpandClick}>
            <circle cx={0} cy={70} r={9} fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.5)" strokeWidth={1.2} />
            <text x={0} y={75} textAnchor="middle" fontSize="13" fontWeight="700" fill="#22d3ee" stroke="none">+</text>
          </g>
        )}

        {loading && (
          <text x={0} y={74} textAnchor="middle" fontSize="8" fill="rgba(34,211,238,0.6)" stroke="none">loading...</text>
        )}
      </g>
    );
  };

  const activeStatus = selectedNode?._topupDate && selectedNode._topupDate !== '0';
  const popupRows = [
    { label: 'Name',         value: selectedNode?.name },
    { label: 'User ID',      value: selectedNode?._userId },
    { label: 'Level',        value: selectedNode?._level },
    { label: 'Joining Date', value: fmtDate(selectedNode?._joiningDate) },
    { label: 'Topup Date',   value: fmtDate(selectedNode?._topupDate) },
  ];

  if (isLoading) return <TreeLoader />;

  if (!treeData) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4"
      style={{ background: '#060d1a' }}>
      <div className="w-20 h-20 rounded-full border border-cyan-400/20 flex items-center justify-center"
        style={{ background: 'rgba(34,211,238,0.06)' }}>
        <FaUser style={{ fontSize: '28px', color: 'rgba(34,211,238,0.4)' }} />
      </div>
      <p className="text-gray-400 text-base font-semibold">No Network Data Found</p>
      <p className="text-gray-600 text-sm">This user's team tree will appear here once members join.</p>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen justify-center items-center" style={{ background: '#060d1a' }}>
        <div className="flex-1 h-screen flex flex-col justify-center items-center">
          <div ref={treeContainerRef} id="treeWrapper" className="w-full h-full" style={{ maxHeight: '100vh' }}>
            <Tree
              data={treeData}
              orientation={verticaa}
              pathFunc={pathfn}
              renderCustomNodeElement={renderCustomNode}
              zoomable={true}
              translate={translate}
              pathClassFunc={() => 'tree-link'}
              collapsible={false}
            />
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, #060d1a 0%, #080f1e 50%, #060a14 100%)',
            border: '1px solid rgba(34,211,238,0.25)',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(34,211,238,0.12), 0 2px 8px rgba(0,0,0,0.6)',
            padding: '4px',
            minWidth: '270px',
          },
        }}
      >
        <MenuItem disableRipple onClick={handleClose}
          style={{ borderRadius: '10px', padding: '8px', background: 'transparent', cursor: 'default' }}>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span style={{ color: '#67e8f9', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Node Details
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(34,211,238,0.2)' }} />
              <button onClick={handleClose}
                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                ✕
              </button>
            </div>

            {popupRows.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg mb-0.5"
                style={{
                  background: idx % 2 === 0 ? 'rgba(34,211,238,0.04)' : 'transparent',
                  borderBottom: '1px solid rgba(34,211,238,0.07)',
                }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {row.label}
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '500', fontFamily: 'monospace', marginLeft: '12px', textAlign: 'right' }}>
                  {row.value || '--'}
                </span>
              </div>
            ))}

            <div className="flex justify-center mt-3">
              <div style={{
                padding: '4px 16px', borderRadius: '20px',
                background: activeStatus ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                border:     activeStatus ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,68,68,0.4)',
              }}>
                <span style={{ color: activeStatus ? '#4ade80' : '#f87171', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {activeStatus ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>
          </div>
        </MenuItem>
      </Menu>

      <style>{`
        .tree-link {
          stroke: rgba(34,211,238,0.3) !important;
          stroke-width: 1.5px !important;
          fill: none !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default AdminTree;