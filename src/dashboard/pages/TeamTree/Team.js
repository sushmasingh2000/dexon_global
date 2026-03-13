import React, { useState, useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { FaUser } from 'react-icons/fa';
import { Menu, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { endpoint } from '../../../utils/APIRoutes';
import { apiConnectorGet } from '../../../utils/APIConnector';
import moment from 'moment/moment';

const Team = () => {
  const [verticaa, setVertica] = useState('vertical');
  const [pathfn, setPathFn] = useState('diagonal');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const open = Boolean(anchorEl);
  const treeContainerRef = useRef(null);
  const handleClose = () => setAnchorEl(null);

  const { data } = useQuery(
    ['tree-downline'],
    () => apiConnectorGet(endpoint.get_member_downline_tree),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const flatData = data?.data?.result || [];

  const buildTreeFromFlatData = (data) => {
    const map = {};
    const rootNodes = [];

    data.forEach((item) => {
      map[item.lgn_cust_id] = {
        // react-d3-tree only reliably exposes: name, attributes, children
        // `attributes` values MUST be primitives (string/number) — not objects
        name: item.lgn_name || 'Unknown',
        attributes: {
          'User ID':      String(item.lgn_cust_id   || ''),
          'Joining Date': String(item.tr03_reg_date  || ''),
          'Topup Date':   String(item.tr03_topup_date || '0'),
          'Sponsor':      String(item.from_cust       || ''),
        },
        children: [],
      };
    });

    data.forEach((item) => {
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
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: dimensions.width / 2, y: dimensions.height / 6 });
    }
  }, [orgChart, verticaa]);

  // Helper to safely read topup status from attributes
  const isNodeActive = (nodeDatum) => {
    const td = nodeDatum?.attributes?.['Topup Date'];
    return td && td !== '0' && td !== 'null' && td !== 'undefined';
  };

  const formatAttrDate = (val) => {
    if (!val || val === '0' || val === 'null' || val === 'undefined') return '--';
    const m = moment(val);
    return m.isValid() ? m.format('DD-MM-YYYY') : val;
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const isActive = isNodeActive(nodeDatum);
    return (
      <g onClick={toggleNode} style={{ cursor: 'pointer' }}>
        <circle r={36} fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.25)' : 'rgba(239,68,68,0.25)'}
          strokeWidth={2} style={{ filter: 'blur(2px)' }} />
        <circle r={33} fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.4)' : 'rgba(239,68,68,0.4)'}
          strokeWidth={1.5} strokeDasharray="4 3" />
        <circle r={28}
          fill={isActive ? '#0e2a30' : '#2a0e0e'}
          stroke={isActive ? '#22d3ee' : '#ef4444'}
          strokeWidth={2} />
        <circle r={22}
          fill={isActive ? 'rgba(34,211,238,0.08)' : 'rgba(239,68,68,0.08)'}
          stroke="none" />
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
        <rect x={-40} y={36} width={80} height={20} rx={6}
          fill={isActive ? 'rgba(14,42,48,0.9)' : 'rgba(42,14,14,0.9)'}
          stroke={isActive ? 'rgba(34,211,238,0.3)' : 'rgba(239,68,68,0.3)'}
          strokeWidth={1} />
        <text x={0} y={51} textAnchor="middle" fontSize="10" fontWeight="600"
          fontFamily="monospace"
          fill={isActive ? '#67e8f9' : '#fca5a5'}
          stroke="none"
          style={{ cursor: 'pointer', letterSpacing: '0.5px' }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(nodeDatum);
            setAnchorEl(e.currentTarget);
          }}
        >
          {nodeDatum.name}
        </text>
        <circle cx={20} cy={-22} r={5}
          fill={isActive ? '#22c55e' : '#ef4444'}
          stroke={isActive ? '#14532d' : '#7f1d1d'}
          strokeWidth={1.5} />
      </g>
    );
  };

  // Build popup rows from attributes directly (keys match exactly what we stored)
  const popupRows = selectedNode
    ? [
        { label: 'Name',         value: selectedNode.name },
        { label: 'User ID',      value: selectedNode.attributes?.['User ID'] },
        { label: 'Joining Date', value: formatAttrDate(selectedNode.attributes?.['Joining Date']) },
        { label: 'Topup Date',   value: formatAttrDate(selectedNode.attributes?.['Topup Date']) },
        { label: 'Sponsor',      value: selectedNode.attributes?.['Sponsor'] || '--' },
      ]
    : [];

  const activeStatus = isNodeActive(selectedNode);

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

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-text' }}
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, #060d1a 0%, #080f1e 50%, #060a14 100%)',
            border: '1px solid rgba(34,211,238,0.25)',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(34,211,238,0.12), 0 2px 8px rgba(0,0,0,0.6)',
            padding: '4px',
            minWidth: '260px',
          },
        }}
      >
        <MenuItem onClick={handleClose} disableRipple
          style={{ borderRadius: '10px', padding: '8px', background: 'transparent' }}>
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span style={{ color: '#67e8f9', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Node Details
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(34,211,238,0.2)' }} />
            </div>

            {/* Rows */}
            {popupRows.map((row, idx) => (
              <div key={idx}
                className="flex items-center justify-between px-2 py-2 rounded-lg mb-1"
                style={{
                  background: idx % 2 === 0 ? 'rgba(34,211,238,0.04)' : 'transparent',
                  borderBottom: '1px solid rgba(34,211,238,0.08)',
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {row.label}
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500', fontFamily: 'monospace' }}>
                  {row.value || '--'}
                </span>
              </div>
            ))}

            {/* Status Badge */}
            <div className="flex justify-center mt-3">
              <div style={{
                padding: '4px 16px', borderRadius: '20px',
                background: activeStatus ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                border:     activeStatus ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,68,68,0.4)',
              }}>
                <span style={{
                  color: activeStatus ? '#4ade80' : '#f87171',
                  fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                }}>
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

export default Team;