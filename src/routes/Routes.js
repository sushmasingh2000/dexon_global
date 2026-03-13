// src/routes/routes.jsx
import Dashboard from "../dashboard/Dashboard";
import Activation from "../dashboard/pages/Activation";
import ClaimTopUp from "../dashboard/pages/ClaimTopUp";
import Fund from "../dashboard/pages/Fund/Fund";
import FundTransfer from "../dashboard/pages/Fund/Transfer";
import Salary from "../dashboard/pages/income/Salary";
import Direct from "../dashboard/pages/income/Direct";
import Level from "../dashboard/pages/income/Level";
import Rank from "../dashboard/pages/income/Rank";
import Reward from "../dashboard/pages/income/Reward";
import ROI from "../dashboard/pages/income/ROI";
import ROIONROI from "../dashboard/pages/income/ROIONROI";
import MainLayout from "../dashboard/pages/Layout/MainLayout";
import Downline from "../dashboard/pages/network/Downline";
import JoinMember from "../dashboard/pages/network/JoinMember";
import Payout from "../dashboard/pages/Payout";
import Profile from "../dashboard/pages/Profile";
import TeamActivation from "../dashboard/pages/TeamActivation";
import Team from "../dashboard/pages/TeamTree/Team";
import Wallet from "../dashboard/pages/Wallet";
import FundTransferToToupWallet from "../dashboard/pages/Topup/FundTransferToToupWallet";
import FundTransferHistory from "../dashboard/pages/FundTransferHistory";
import TopupHistory from "../dashboard/pages/TopupHistory";
import PayoutReport from "../dashboard/pages/PayoutReport";
import GlobalDepositHistory from "../dashboard/pages/globalhistory/GlobalDepositHistory";
import GlobalWithdrawalHistory from "../dashboard/pages/globalhistory/GlobalWithdrawalHistory";
import GlobalDashboard from "../dashboard/pages/globalhistory/GlobalDashboard";
import AutoCompounding from "../dashboard/pages/income/AutoCompounding";
import TopupByRandomQR from "../dashboard/pages/Topup/TopupByRandomQR";
import TopupUpWithoutPull from "../dashboard/pages/Topup/TopupUpWithoutPull";
import TicketSupport from "../dashboard/pages/ticketSupport"

export const routes = [
  {
    path: "/dashboard",
    element: (
      <MainLayout>
        <Dashboard />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/claim_topup",
    element: (
      <MainLayout>
        <ClaimTopUp />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/with",
    element: (
      <MainLayout>
        <Payout />{" "}
      </MainLayout>
    ),
  },
  // {
  //   path: '/topup_data',
  //   element: ( <MainLayout><ActivationWithFSTAndPull /> </MainLayout>),
  // },
  {
    path: "/topup_data",
    element: (
      <MainLayout>
        <TopupUpWithoutPull />{" "}
      </MainLayout>
    ),
  },
  // {
  //   path: "/topup_data",
  //   element: (
  //     <MainLayout>
  //       <TopupByRandomQR />{" "}
  //     </MainLayout>
  //   ),
  // },
  {
    path: "/topup_history",
    element: (
      <MainLayout>
        <TopupHistory />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/fund-transfer-to-topup-wallet",
    element: (
      <MainLayout>
        <FundTransferToToupWallet />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/fund",
    element: (
      <MainLayout>
        <Fund />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/level",
    element: (
      <MainLayout>
        <Level />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/salary",
    element: (
      <MainLayout>
        <Salary />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/roi",
    element: (
      <MainLayout>
        <ROI />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/roi-on-roi",
    element: (
      <MainLayout>
        <ROIONROI />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/direct",
    element: (
      <MainLayout>
        <Direct />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/activation",
    element: (
      <MainLayout>
        <Activation />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/fund-transfer-history",
    element: (
      <MainLayout>
        <FundTransferHistory />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/team-activation",
    element: (
      <MainLayout>
        <TeamActivation />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/wallet",
    element: (
      <MainLayout>
        <Wallet />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <MainLayout>
        <Profile />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/payout-report",
    element: (
      <MainLayout>
        <PayoutReport />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/fund-tranfer",
    element: (
      <MainLayout>
        <FundTransfer />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/referral",
    element: (
      <MainLayout>
        <JoinMember />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/team",
    element: (
      <MainLayout>
        <Team />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/downline",
    element: (
      <MainLayout>
        <Downline />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/reward",
    element: (
      <MainLayout>
        <Reward />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/income/rank",
    element: (
      <MainLayout>
        <Rank />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/global-deposit",
    element: (
      <MainLayout>
        <GlobalDepositHistory />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/global-withdrawal",
    element: (
      <MainLayout>
        <GlobalWithdrawalHistory />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/global-dashboard",
    element: (
      <MainLayout>
        <GlobalDashboard />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/auto-compounding-history",
    element: (
      <MainLayout>
        <AutoCompounding />{" "}
      </MainLayout>
    ),
  },
  {
    path: "/ticket_support",
    element: (
      <MainLayout>
        <TicketSupport />{" "}
      </MainLayout>
    ),
  },
];
