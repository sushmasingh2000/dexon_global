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
import RankBonus from "../Pages/income/RankBonus";
import RewardBonus from "../Pages/income/RewardBonus";
import Ticket from "../Pages/Ticket/ticket";
import SubadminPermission from "../Pages/subadmin/subadminPer";
import P2PFundTrasnfer from "../Pages/fundmanagement/p2pFundTransfer";
import MasterConfig from "../Pages/masterConfig/masterConfig";
import WebPopup from "../Pages/webpopup/WebPopup";
import SocialMedia from "../Pages/socialmedia/SoacilaMedia";
import PermissionGate from "../Shared/PermissionGate";

export const adminroutes = [
  {
    id: 2,
    path: "/admindashboard",
    component: <PermissionGate require="dashboard.view"><Dashboard /></PermissionGate>,
    navItem: "Dashboard",
  },
  {
    id: 3,
    path: "/masterConfig",
    component: <MasterConfig />,
    navItem: "Master Config",
  },
  {
    id: 19,
    path: "/levelBonus",
    component: <PermissionGate require="reports.income"><LevelBonus /></PermissionGate>,
    navItem: "Community Level Income",
  },
  {
    id: 19,
    path: "/directBonus",
    component: <PermissionGate require="reports.income"><DirectBonus /></PermissionGate>,
    navItem: "Sponsor Income",
  },
  {
    id: 19,
    path: "/roiBonus",
    component: <PermissionGate require="reports.income"><ROIBonus /></PermissionGate>,
    navItem: "Trading Income",
  },
  {
    id: 19,
    path: "/memberList",
    component: <PermissionGate require="members.view"><MemberList /></PermissionGate>,
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
    component: <PermissionGate require="fund.topup"><TopUp /></PermissionGate>,
    navItem: "Top Up",
  },
  {
    id: 45,
    path: "/payoutReport",
    component: <PermissionGate require="reports.withdrawal"><PayoutReport /></PermissionGate>,
    navItem: "Withdrawal Report",
  },
  {
    id: 46,
    path: "/fundTransferHistory",
    component: <PermissionGate require="reports.fund_request"><FundTransferHistory /></PermissionGate>,
    navItem: "Fund Transfer History",
  },
  {
    id: 47,
    path: "/topupHistory",
    component: <PermissionGate require="reports.topup"><TopupHistory /></PermissionGate>,
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
    component: <PermissionGate require={["news.create", "news.update", "news.toggle_status"]}><NewsAndUpdated /></PermissionGate>,
    navItem: "News And Updated",
  },
  {
    id: 48,
    path: "/trade_pairs",
    component: <PermissionGate require={["trade.create", "trade.update_status", "trade.delete"]}><TradePair /></PermissionGate>,
    navItem: "Trade & Pair",
  },
  {
    id: 49,
    path: "/update-trade-profit",
    component: <PermissionGate require="trade.update_profit"><UpdateROICond /></PermissionGate>,
    navItem: "Update Trade Profit",
  },
  {
    id: 50,
    path: "/leadershipRankBonus",
    component: <PermissionGate require="reports.income"><RankBonus /></PermissionGate>,
    navItem: "Leadership Rank Bonus",
  },
  {
    id: 51,
    path: "/rewardBonus",
    component: <PermissionGate require="reports.income"><RewardBonus /></PermissionGate>,
    navItem: "Dexon Global Reward Pool",
  },
  {
    id: 52,
    path: "/tickets",
    component: <PermissionGate require="tickets.view"><Ticket /></PermissionGate>,
    navItem: "Dexon Global Tickets",
  },
  {
    id: 53,
    path: "/subadmin-permission",
    component: <PermissionGate require="subadmin.view"><SubadminPermission /></PermissionGate>,
    navItem: "Subadmin Permission",
  },
  {
    id: 53,
    path: "/p2pTransferHistory",
    component: <PermissionGate require="reports.fund_request"><P2PFundTrasnfer /></PermissionGate>,
    navItem: "Subadmin Permission",
  },
  {
    id: 48,
    path: "/web_popup",
    component: <PermissionGate require={["popups.create", "popups.delete"]}><WebPopup /></PermissionGate>,
    navItem: "Web Popup",
  },
  {
    id: 48,
    path: "/social_media",
    component: <PermissionGate require={["social.create", "social.update", "social.delete"]}><SocialMedia /></PermissionGate>,
    navItem: "Social Media Platform",
  },
];
