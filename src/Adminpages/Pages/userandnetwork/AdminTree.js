import React, { useState, useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { FaUser } from 'react-icons/fa';
import { Menu, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { endpoint } from '../../../utils/APIRoutes';
import { apiConnectorGetAdmin } from '../../../utils/APIConnector';
import moment from 'moment/moment';
import { useLocation } from 'react-router-dom';

const AdminTree = () => {
  const [verticaa]                      = useState('vertical');
  const [pathfn]                        = useState('diagonal');
  const [anchorEl, setAnchorEl]         = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [translate, setTranslate]       = useState({ x: 0, y: 0 });

  const location = useLocation();
  const userId   = location.state.userId;

  const open             = Boolean(anchorEl);
  const treeContainerRef = useRef(null);
  const handleClose      = () => setAnchorEl(null);

  const { data } = useQuery(
    ['tree-downline-admin', userId],
    () => apiConnectorGetAdmin(endpoint.get_member_downline_tree, { userId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const flatData = data?.data?.result || [];

  // ── Build tree — store ALL fields at top level with _ prefix ─────────────
  // react-d3-tree v3 passes the full raw node as nodeDatum in custom renderers,
  // so top-level fields are always accessible. Using _ prefix avoids any
  // collision with library-reserved keys (name, children, attributes).
  const buildTreeFromFlatData = (items) => {
    const map       = {};
    const rootNodes = [];

    items.forEach((item) => {
      map[item.lgn_cust_id] = {
        name:         item.lgn_name        || 'Unknown',
        _userId:      item.lgn_cust_id     || '',
        _joiningDate: item.tr03_reg_date   || '',
        _topupDate:   item.tr03_topup_date || '0',
        _email:       item.lgn_email       || '',
        _mobile:      item.lgn_mobile      || '',
        _sponsor:     item.from_cust       || '',
        children: [],
      };
    });

    items.forEach((item) => {
      const node = map[item.lgn_cust_id];
      if (!item.from_cust || !map[item.from_cust]) {
        rootNodes.push(node);
      } else {
        map[item.from_cust].children.push(node);
      }
    });

    return rootNodes[0];
  };

  const orgChart = buildTreeFromFlatData(flatData);

  useEffect(() => {
    if (treeContainerRef.current) {
      const dim = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: dim.width / 2, y: dim.height / 6 });
    }
  }, [orgChart, verticaa]);

  const fmtDate = (val) => {
    if (!val || val === '0' || val === 'null' || val === 'undefined') return '--';
    const m = moment(val);
    return m.isValid() ? m.format('DD-MM-YYYY') : String(val);
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const isActive = nodeDatum._topupDate && nodeDatum._topupDate !== '0';

    return (
      <g onClick={toggleNode} style={{ cursor: 'pointer' }}>
        {/* Outer glow ring */}
        <circle r={36} fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.25)' : 'rgba(239,68,68,0.25)'}
          strokeWidth={2} style={{ filter: 'blur(2px)' }} />
        {/* Pulse ring */}
        <circle r={33} fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.4)' : 'rgba(239,68,68,0.4)'}
          strokeWidth={1.5} strokeDasharray="4 3" />
        {/* Main circle */}
        <circle r={28}
          fill={isActive ? '#0e2a30' : '#2a0e0e'}
          stroke={isActive ? '#22d3ee' : '#ef4444'}
          strokeWidth={2} />
        {/* Inner highlight */}
        <circle r={22}
          fill={isActive ? 'rgba(34,211,238,0.08)' : 'rgba(239,68,68,0.08)'}
          stroke="none" />
        {/* Icon */}
        <foreignObject x={-16} y={-16} width={32} height={32}>
          <div xmlns="http://www.w3.org/1999/xhtml"
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaUser style={{
              fontSize: '18px',
              color: isActive ? '#22d3ee' : '#ef4444',
              filter: `drop-shadow(0 0 4px ${isActive ? '#22d3ee' : '#ef4444'})`,
            }} />
          </div>
        </foreignObject>
        {/* Name label bg */}
        <rect x={-40} y={36} width={80} height={20} rx={6}
          fill={isActive ? 'rgba(14,42,48,0.9)' : 'rgba(42,14,14,0.9)'}
          stroke={isActive ? 'rgba(34,211,238,0.3)' : 'rgba(239,68,68,0.3)'}
          strokeWidth={1} />
        {/* Name text — click opens popup */}
        <text x={0} y={51} textAnchor="middle"
          fontSize="10" fontWeight="600" fontFamily="monospace"
          fill={isActive ? '#67e8f9' : '#fca5a5'}
          stroke="none"
          style={{ cursor: 'pointer', letterSpacing: '0.5px' }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(nodeDatum);   // full node with all _fields
            setAnchorEl(e.currentTarget);
          }}
        >
          {nodeDatum.name}
        </text>
        {/* Status dot */}
        <circle cx={20} cy={-22} r={5}
          fill={isActive ? '#22c55e' : '#ef4444'}
          stroke={isActive ? '#14532d' : '#7f1d1d'}
          strokeWidth={1.5} />
      </g>
    );
  };

  const activeStatus = selectedNode?._topupDate && selectedNode._topupDate !== '0';

  const popupRows = [
    { label: 'Name',         value: selectedNode?.name },
    { label: 'User ID',      value: selectedNode?._userId },
    // { label: 'Email',        value: selectedNode?._email },
    // { label: 'Mobile',       value: selectedNode?._mobile },
    // { label: 'Sponsor',      value: selectedNode?._sponsor },
    { label: 'Joining Date', value: fmtDate(selectedNode?._joiningDate) },
    { label: 'Topup Date',   value: fmtDate(selectedNode?._topupDate) },
  ];

  return (
    <>
      <div className="flex min-h-screen justify-center items-center" style={{ background: '#060d1a' }}>
        <div className="flex-1 h-screen flex flex-col justify-center items-center">
          <div ref={treeContainerRef} id="treeWrapper" className="w-full h-full" style={{ maxHeight: '100vh' }}>
            {orgChart && (
              <Tree
                data={orgChart}
                orientation={verticaa}
                pathFunc={pathfn}
                renderCustomNodeElement={renderCustomNode}
                zoomable={false}
                translate={translate}
                pathClassFunc={() => 'tree-link'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Node Details Popup */}
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

            {/* Header */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span style={{ color: '#67e8f9', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Node Details
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(34,211,238,0.2)' }} />
              <button onClick={handleClose}
                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                ✕
              </button>
            </div>

            {/* Rows */}
            {popupRows.map((row, idx) => (
              <div key={idx}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg mb-0.5"
                style={{
                  background: idx % 2 === 0 ? 'rgba(34,211,238,0.04)' : 'transparent',
                  borderBottom: '1px solid rgba(34,211,238,0.07)',
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {row.label}
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '500', fontFamily: 'monospace', marginLeft: '12px', textAlign: 'right' }}>
                  {row.value || '--'}
                </span>
              </div>
            ))}

            {/* Status badge */}
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
    </>
  );
};

export default AdminTree;