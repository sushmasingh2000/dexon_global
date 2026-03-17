import {
  FaChartPie,
  FaCoins,
  FaHandHoldingUsd,
  FaLayerGroup,
  FaTrophy,
  FaGlobe,
  FaUniversity,
  FaWallet,
  FaFileInvoiceDollar,
  FaExchangeAlt,
  FaHistory,
  FaUsers,
  FaListUl,
  FaUserFriends,
  FaRobot,
  FaHeadset,
  FaBullhorn,
  FaChartLine,
} from "react-icons/fa";

const iconStyle = { color: "#749df5", fontSize: "1.25rem" };

export const all_Data = [
  {
    id: 2,
    navLink: "/admindashboard",
    navItem: "Dashboard",
    navIcon: <span><FaChartPie style={iconStyle} /></span>,
    subcomponent: [],
  },

  {
    id: 6,
    navLink: "/directBonus",
    navItem: "Income",
    navIcon: <span><FaWallet style={iconStyle} /></span>,
    subcomponent: [
      {
        id: 6.5,
        navLink: "/roiBonus",
        navItem: "Trading Income",
        navIcon: <span><FaChartLine style={iconStyle} /></span>,
      },
      {
        id: 6.4,
        navLink: "/directBonus",
        navItem: "Sponsor Income",
        navIcon: <span><FaHandHoldingUsd style={iconStyle} /></span>,
      },
      {
        id: 6.3,
        navLink: "/levelBonus",
        navItem: "Community Level Income",
        navIcon: <span><FaLayerGroup style={iconStyle} /></span>,
      },
      {
        id: 6.2,
        navLink: "/leadershipRankBonus",
        navItem: "Leadership Rank Bonus",
        navIcon: <span><FaTrophy style={iconStyle} /></span>,
      },
      {
        id: 6.1,
        navLink: "/rewardBonus",
        navItem: "Dexon Global Reward Pool",
        navIcon: <span><FaGlobe style={iconStyle} /></span>,
      },
    ],
  },

  {
    id: 7,
    navLink: "/topup",
    navItem: "Fund Management",
    navIcon: <span><FaUniversity style={iconStyle} /></span>,
    subcomponent: [
      {
        id: 7.4,
        navLink: "/topup",
        navItem: "Member Topup",
        navIcon: <span><FaCoins style={iconStyle} /></span>,
      },
      {
        id: 7.3,
        navLink: "/payoutReport",
        navItem: "Withdrawal Report",
        navIcon: <span><FaFileInvoiceDollar style={iconStyle} /></span>,
      },
      {
        id: 7.5,
        navLink: "/fundTransferHistory",
        navItem: "Fund Transfer History",
        navIcon: <span><FaExchangeAlt style={iconStyle} /></span>,
      },
      {
        id: 7.6,
        navLink: "/topupHistory",
        navItem: "Member Topup History",
        navIcon: <span><FaHistory style={iconStyle} /></span>,
      },
    ],
  },

  {
    id: 8,
    navLink: "/memberList",
    navItem: "Member & Team",
    navIcon: <span><FaUsers style={iconStyle} /></span>,
    subcomponent: [
      {
        id: 8.1,
        navLink: "/memberList",
        navItem: "Member List",
        navIcon: <span><FaListUl style={iconStyle} /></span>,
      },
      {
        id: 8.2,
        navLink: "/teamAndMembers",
        navItem: "Team Members",
        navIcon: <span><FaUserFriends style={iconStyle} /></span>,
      },
    ],
  },

  {
    id: 9,
    navLink: "/trade_pairs",
    navItem: "Trade & Pairs",
    navIcon: <span><FaRobot style={iconStyle} /></span>,
    subcomponent: [],
  },

  {
    id: 10,
    navLink: "/tickets",
    navItem: "Ticket & Support",
    navIcon: <span><FaHeadset style={iconStyle} /></span>,
    subcomponent: [],
  },

  {
    id: 11,
    navLink: "/newsAnnouncement",
    navItem: "News & Announcement",
    navIcon: <span><FaBullhorn style={iconStyle} /></span>,
    subcomponent: [],
  },

  {
    id: 12,
    navLink: "/update-trade-profit",
    navItem: "Update Trade Profit",
    navIcon: <span><FaChartLine style={iconStyle} /></span>,
    subcomponent: [],
  },
  {
    id: 12,
    navLink: "/subadmin-permission",
    navItem: "Subadmin Permission",
    navIcon: <span><FaChartLine style={iconStyle} /></span>,
    subcomponent: [],
  },
];