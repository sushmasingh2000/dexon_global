import Dashboard from "../Pages/dashboard/Dashboard";

import DownlineTeams from "../../dashboard/pages/Team/DownlineTeams";
import LevelBonus from "../Pages/income/LevelBonus";
import TopUp from "../Pages/fundmanagement/Topup";
import DirectBonus from "../Pages/income/DirectBonus";
import ROIBonus from "../Pages/income/ROIBonus";
import MemberList from "../Pages/userandnetwork/MemberList";
import PayoutReport from "../Pages/fundmanagement/PayoutReport";
import FundTransferHistory from "../Pages/fundmanagement/FundTransferHistory";
import TopupHistory from "../Pages/fundmanagement/TopupHistory";
import DownlineTeam from "../Pages/userandnetwork/DownlineTeam";
import AdminTree from "../Pages/userandnetwork/AdminTree";
import TeamAndMembers from "../Pages/userandnetwork/TeamAndMembers";
import NewsAndUpdated from "../Pages/newsupdates/NewsAndUpdated";
import TradePair from "../Pages/tradePair/TradePair";
import UpdateROICond from "../Pages/income/UpdateROICond";

export const adminroutes = [
  {
    id: 2,
    path: "/admindashboard",
    component: <Dashboard />,
    navItem: "Dashboard",
  },
  {
    id: 19,
    path: "/levelBonus",
    component: <LevelBonus />,
    navItem: "Community Level Income",
  },
  {
    id: 19,
    path: "/directBonus",
    component: <DirectBonus />,
    navItem: "Sponsor Income",
  },
  {
    id: 19,
    path: "/roiBonus",
    component: <ROIBonus />,
    navItem: "Trading Income",
  },
  {
    id: 19,
    path: "/memberList",
    component: <MemberList />,
    navItem: "Member List",
  },


  {
    id: 43,
    path: "/down_team",
    component: <DownlineTeams />,
    navItem: "Downline Team",
  },
  {
    id: 44,
    path: "/topup",
    component: <TopUp />,
    navItem: "Top Up",
  },
  {
    id: 45,
    path: "/payoutReport",
    component: <PayoutReport />,
    navItem: "Withdrawal Report",
  },
  {
    id: 46,
    path: "/fundTransferHistory",
    component: <FundTransferHistory />,
    navItem: "Fund Transfer History",
  },
  {
    id: 47,
    path: "/topupHistory",
    component: <TopupHistory />,
    navItem: "Member Topup History",
  },
  {
    id: 47,
    path: "/downlineTeam",
    component: <DownlineTeam />,
    navItem: "Downline Team",
  },
  {
    id: 47,
    path: "/downlineTree",
    component: <AdminTree />,
    navItem: "Downline Tree",
  },
  {
    id: 47,
    path: "/teamAndMembers",
    component: <TeamAndMembers />,
    navItem: "Team And Members",
  },
  {
    id: 47,
    path: "/newsAnnouncement",
    component: <NewsAndUpdated />,
    navItem: "News And Updated",
  },
  {
    id: 48,
    path: "/trade_pairs",
    component: <TradePair />,
    navItem: "Trade & Pair",
  },
  {
    id: 49,
    path: "/update-trade-profit",
    component: <UpdateROICond />,
    navItem: "Update Trade Profit",
  },

];
