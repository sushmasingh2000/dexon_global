import { Person } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CampaignIcon from "@mui/icons-material/Campaign";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HistoryIcon from "@mui/icons-material/History";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WalletIcon from "@mui/icons-material/Wallet";
export const all_Data = [
  {
    id: 2,
    navLink: "/admindashboard",
    navItem: "Dashboard",
    navIcon: (
      <span>
        <DashboardCustomizeIcon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

  {
    id: 6,
    navLink: "/directBonus",
    navItem: "Income",
    navIcon: (
      <span>
        <AccountBalanceWalletIcon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 6.5,
        navLink: "/roiBonus",
        navItem: "Trading Income",
        navIcon: (
          <span>
            <PaidIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 6.4,
        navLink: "/directBonus",
        navItem: "Sponsor Income",
        navIcon: (
          <span>
            <GroupAddIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 6.3,
        navLink: "/levelBonus",
        navItem: "Community Level Income",
        navIcon: (
          <span>
            <StackedLineChartIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },

    ],
  },
  {
    id: 7,
    navLink: "/topup",
    navItem: "Fund Management",
    navIcon: (
      <span>
        <AccountBalanceIcon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [

      {
        id: 7.4,
        navLink: "/topup",
        navItem: "Member Topup",
        navIcon: (
          <span>
            <WalletIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 7.3,
        navLink: "/payoutReport",
        navItem: "Withdrawal Report",
        navIcon: (
          <span>
            <ReceiptLongIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 7.5,
        navLink: "/fundTransferHistory",
        navItem: "Fund Transfer History",
        navIcon: (
          <span>
            <SwapHorizIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 7.5,
        navLink: "/topupHistory",
        navItem: "Member Topup History",
        navIcon: (
          <span>
            <HistoryIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
    ],
  },
  {
    id: 7,
    navLink: "/memberList",
    navItem: "Member & Team",
    navIcon: (
      <span>
        <Diversity3Icon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 7.5,
        navLink: "/memberList",
        navItem: "Member List",
        navIcon: (
          <span>
            <FormatListBulletedIcon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },
      {
        id: 7.4,
        navLink: "/teamAndMembers",
        navItem: "Team Members",
        navIcon: (
          <span>
            <Diversity3Icon sx={{ color: "#749df5" }} fontSize="medium" />
          </span>
        ),
      },


    ],
  },
  {
    id: 7,
    navLink: "/trade_pairs",
    navItem: "Trade & Pairs",
    navIcon: (
      <span>
        <Person sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [
    ],
  },
  {
    id: 7,
    navLink: "/newsAnnouncement",
    navItem: "News & Announcement",
    navIcon: (
      <span>
        <CampaignIcon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [
    ],
  },
  {
    id: 7,
    navLink: "/update-trade-profit",
    navItem: "Update Trade Profit",
    navIcon: (
      <span>
        <CampaignIcon sx={{ color: "#749df5" }} fontSize="medium" />
      </span>
    ),
    subcomponent: [
    ],
  },


];
