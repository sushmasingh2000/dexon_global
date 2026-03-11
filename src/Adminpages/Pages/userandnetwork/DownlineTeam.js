import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import { apiConnectorGet, apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { MenuItem, Select } from "@mui/material";
import CustomToPagination from "../../../Shared/Pagination";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import { useLocation } from "react-router-dom";

const DownlineTeam = () => {
  const location = useLocation()
  const [level, setLevel] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const userId = location.state.userId;

  const { isLoading, data: team_data } = useQuery(
    ["get_direct_member", level, userId, page, limit],
    () =>
      apiConnectorPostAdmin(
        `${endpoint?.team_data_api}`, {
        level_id: level,
        page: page,
        limit: limit,
        user_id: userId,
      }
      ),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const data = team_data?.data?.result || [];

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };
  const tablehead = [
    <span>S.No.</span>,
    <span>Cust Id</span>,
    <span>Name</span>,
    <span>Level</span>,
    <span>TopUp Amount ($)</span>,
    <span>Join Date</span>,
    <span>TopUp Date</span>,
  ];
  const tablerow = data?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>{row.lgn_cust_id}</span>,
      <span>{row.lgn_name}</span>,
      <span>{row.level_id || "N/A"}</span>,
      <span>{getFloatingValue(row.tr03_topup_wallet)}</span>,
      <span>{formatedDate(moment, row.tr03_reg_date)}</span>,
      <span>
        {formatedDate(moment, row.tr03_topup_date)}
      </span>,
    ];
  });
  return (
    <div className="p-2">
      {/* Heading */}
      <h2
        className="
        text-xl font-semibold mb-4 text-gray-200
        px-4 py-2 rounded-md
        bg-black
        shadow-md shadow-white/30 text-center
      "
      >
        Team Members
      </h2>

      {/* Controls + Stats */}
      {/* <div
        className="
        bg-black rounded-lg
        border border-gray-700
        p-4 mb-4
        shadow-md shadow-white/20
        text-white
      "
      >
        <div className="mb-4">
          <p className="text-text-color mb-2 text-sm">
            {localStorage.getItem("isCP") === "Yes" ? "Enter" : "Select"} Level:
          </p> */}

      {/* <div className="flex flex-col md:flex-row gap-3">
            {localStorage.getItem("isCP") === "No" ? ( */}
      <Select
        value={level}
        onChange={(e) => handleLevelChange(Number(e.target.value))}
        className=" rounded w-full md:w-1/2 !bg-black !text-white"
        size="small"
      >
        {[...Array(15)].map((_, index) => (
          <MenuItem key={index} value={index + 1}>
            Level {index + 1}
          </MenuItem>
        ))}
      </Select>
      {/* ) : (
              <input
                type="number"
                placeholder="Enter Level"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="px-4 py-2 rounded w-full md:w-1/2 bg-white text-black"
              />
            )}

            {localStorage.getItem("isCP") === "Yes" && (
              <Button
                onClick={() => setSearchTrigger((prev) => prev + 1)}
                size="small"
                variant="contained"
                className="md:self-center"
              >
                Search
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-between text-sm">
          <p>
            Total Count:{" "}
            <span className="text-gold-color font-bold">
              {data?.length || 0}
            </span>
          </p>

          <p>
            Total Buss:{" "}
            <span className="text-gold-color font-bold">
              {data
                ?.reduce((a, b) => a + Number(b?.jnr_topup_wallet || 0), 0)
                ?.toFixed(2)}
              $
            </span>
          </p>
        </div>
      </div> */}

      {/* Table Section */}
      <div
        className="
        rounded-lg py-3
        text-white
        bg-black
        border border-gray-700
        shadow-md shadow-white/20
      "
      >
        <CustomTable
          tablehead={tablehead}
          tablerow={tablerow}
          isLoading={isLoading}
        />

        {/* Pagination (optional) */}
        <CustomToPagination page={page} setPage={setPage} data={data} />
      </div>
    </div>
  );
};

export default DownlineTeam;
