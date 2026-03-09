import React, { useState, useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { FaUser } from 'react-icons/fa';
import { Menu, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { endpoint } from '../../../utils/APIRoutes';
import { apiConnectorGet } from '../../../utils/APIConnector';
import moment from 'moment/moment';

const Team = () => {
  const [verticaa, setVertica] = useState('vertical');
  const [pathfn, setPathFn] = useState('diagonal');
  const [showSidebar, setShowSidebar] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const open = Boolean(anchorEl);
  const treeContainerRef = useRef(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        name: item.lgn_name,
        mem_id: item.lgn_cust_id,
        joining_date: item.tr03_reg_date,
        topup_date: item.tr03_topup_date || '0',
        email: item.lgn_email,
        mobile: item.lgn_mobile,
        sponsor: item.from_cust,
        children: [],
      };
    });

    data.forEach((item) => {
      const node = map[item.lgn_cust_id];
      // If no sponsor or sponsor not in map, treat as root
      if (!item.from_cust || !map[item.from_cust]) {
        rootNodes.push(node);
      } else {
        map[item.from_cust].children.push(node);
      }
    });

    return rootNodes[0];
  };

  const orgChart = buildTreeFromFlatData(flatData);

  // 🧠 Dynamically center the tree
  useEffect(() => {
    if (treeContainerRef.current) {
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 6,
      });
    }
  }, [orgChart, verticaa]);

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const isActive = nodeDatum.topup_date !== '0';

    return (
      <g onClick={toggleNode} style={{ cursor: 'pointer' }}>
        {/* Outer glow ring */}
        <circle
          r={36}
          fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.25)' : 'rgba(239,68,68,0.25)'}
          strokeWidth={2}
          style={{ filter: `blur(2px)` }}
        />

        {/* Animated pulse ring */}
        <circle
          r={33}
          fill="none"
          stroke={isActive ? 'rgba(34,211,238,0.4)' : 'rgba(239,68,68,0.4)'}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {/* Main circle - gradient via filter */}
        <circle
          r={28}
          fill={isActive ? '#0e2a30' : '#2a0e0e'}
          stroke={isActive ? '#22d3ee' : '#ef4444'}
          strokeWidth={2}
        />

        {/* Inner highlight */}
        <circle
          r={22}
          fill={isActive ? 'rgba(34,211,238,0.08)' : 'rgba(239,68,68,0.08)'}
          stroke="none"
        />

        {/* Icon via foreignObject */}
        <foreignObject x={-16} y={-16} width={32} height={32}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaUser
              style={{
                fontSize: '18px',
                color: isActive ? '#22d3ee' : '#ef4444',
                filter: `drop-shadow(0 0 4px ${isActive ? '#22d3ee' : '#ef4444'})`,
              }}
            />
          </div>
        </foreignObject>

        {/* Name label background */}
        <rect
          x={-40}
          y={36}
          width={80}
          height={20}
          rx={6}
          fill={isActive ? 'rgba(14,42,48,0.9)' : 'rgba(42,14,14,0.9)'}
          stroke={isActive ? 'rgba(34,211,238,0.3)' : 'rgba(239,68,68,0.3)'}
          strokeWidth={1}
        />

        {/* Name text */}
        <text
          x={0}
          y={51}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
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

        {/* Status dot */}
        <circle
          cx={20}
          cy={-22}
          r={5}
          fill={isActive ? '#22c55e' : '#ef4444'}
          stroke={isActive ? '#14532d' : '#7f1d1d'}
          strokeWidth={1.5}
        />
      </g>
    );
  };
  return (
    <>
      <div
        className="flex min-h-screen justify-center items-center"
        style={{ background: '#060d1a' }}
      >
        {/* Mobile Toggle */}
        {/* <div className="md:hidden fixed top-4 right-3 z-50">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-full border border-cyan-400/30 bg-[#0a1525] shadow-lg shadow-cyan-400/10 hover:border-cyan-400/60 transition-all duration-300"
          >
            <WidgetsIcon style={{ color: '#22d3ee', fontSize: '24px' }} />
          </button>
        </div> */}

        {/* Tree Chart */}
        <div
          className={`flex-1 h-screen flex flex-col justify-center items-center ${showSidebar ? 'pl-[250px]' : 'pl-0'
            }`}
        >
          <div
            ref={treeContainerRef}
            id="treeWrapper"
            className="w-full h-full"
            style={{ maxHeight: '100vh' }}
          >
            {orgChart && (
              <Tree
                data={orgChart}
                orientation={verticaa}
                pathFunc={pathfn}
                renderCustomNodeElement={renderCustomNode}
                zoomable={false}
                translate={translate}
                /* ✅ Yahi lines ko white/cyan banata hai dark bg par */
                pathClassFunc={() => 'tree-link'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Node Details Menu - Premium Dark */}
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
        <MenuItem
          onClick={handleClose}
          disableRipple
          style={{ borderRadius: '10px', padding: '8px', background: 'transparent' }}
        >
          <div className="w-full">

            {/* Header */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span
                style={{
                  color: '#67e8f9',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Node Details
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(34,211,238,0.2)' }}></div>
            </div>

            {/* Rows */}
            {[
              { label: 'Name', value: selectedNode?.name },
              {
                label: 'Joining Date',
                value: selectedNode?.joining_date,
              },
              {
                label: 'Topup Date',
                value:
                  selectedNode?.topup_date === '0'
                    ? '--'
                    : moment(selectedNode?.topup_date)?.format('DD-MM-YYYY'),
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2 py-2 rounded-lg mb-1"
                style={{
                  background: idx % 2 === 0 ? 'rgba(34,211,238,0.04)' : 'transparent',
                  borderBottom: '1px solid rgba(34,211,238,0.08)',
                }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: 'monospace',
                  }}
                >
                  {row.value || '--'}
                </span>
              </div>
            ))}

            {/* Status Badge */}
            <div className="flex justify-center mt-3">
              <div
                style={{
                  padding: '4px 16px',
                  borderRadius: '20px',
                  background:
                    selectedNode?.topup_date !== '0'
                      ? 'rgba(34,197,94,0.15)'
                      : 'rgba(239,68,68,0.15)',
                  border:
                    selectedNode?.topup_date !== '0'
                      ? '1px solid rgba(34,197,94,0.4)'
                      : '1px solid rgba(239,68,68,0.4)',
                }}
              >
                <span
                  style={{
                    color: selectedNode?.topup_date !== '0' ? '#4ade80' : '#f87171',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedNode?.topup_date !== '0' ? '● Active' : '● Inactive'}
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
