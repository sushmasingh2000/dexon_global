import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";
import { areYouSureFn, formatedDate, getFloatingValue } from "../../utils/utilityFun";
import Swal from "sweetalert2";

const ClaimTopUp = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const initialValues = {
    search: "",
    count: 10,
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
  });
  const { data, isLoading } = useQuery(
    [
      "get_claim_topup_history",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.get_wallet_transactions, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: "10"
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const allData = data?.data?.result || [];

  const claimPendingData = async (trans_id) => {
    try {
      const response = await apiConnectorPost(endpoint?.member_claimed_pending_transaction, {
        t_id: trans_id
      });
      if (response?.data?.success) {
        Swal.fire("Success", response?.data?.msg || "Claim successful", "success");
        client.invalidateQueries(["get_claim_topup_history"]);
      } else {
        Swal.fire("Error", response?.data?.msg || "Claim failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "An error occurred", "error");
    }
  }
  const tablehead = [
    "S.No.",
    "Transaction",
    "Amount ($)",
    "Date/Time",
    "BEP-20 Address",
    "Status",
    "Hex Code",
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span>{index + 1}</span>,
      <span>{row?.m06_trans_id}</span>,
      <span>{getFloatingValue(row.m06_rece_amount, 3)}</span>,
      <span>{formatedDate(moment, row?.m06_created_at)}</span>,
      <span className="flex items-center gap-2">
        {row?.m06_wallet}
        <button
          className="text-xs px-2 py-1 rounded bg-gray-700 text-white hover:bg-purple-600 transition"
          onClick={() => navigator.clipboard.writeText(row?.m06_wallet)}
          title="Copy address"
        >
          Copy
        </button>
      </span>,
      row?.m06_is_claimed === 0 ? (
        <span
          className="!text-green-600 cursor-pointer underline"
          onClick={() => {
            areYouSureFn(Swal, claimPendingData, row?.m06_uw_id)
          }
          }
        >
          Claim
        </span>
      ) : (
        <span className="!text-gray-600">Claimed</span>
      ),
      <span
        className="!text-blue-500 underline"
        onClick={() => window.open(`https://bscscan.com/tx/${row?.tr_hex_code}`, "_blank")}
      >{row?.tr_hex_code}</span>,
    ];
  });

  return (
    <div className="p-2">
      {/* <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white border border-gray-700 mb-6"> */}
      <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center shadow-md shadow-white/30 px-4 py-2 rounded-md ">
        Claim Your Transactons
      </h2>

      {/* <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base">
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={fk.values.start_date}
            onChange={fk.handleChange}
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={fk.values.end_date}
            onChange={fk.handleChange}
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
         
          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_actiavtion"]);
            }}
            type="submit"
            className="bg-gold-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-dark-color transition-colors w-full sm:w-auto text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              fk.handleReset();
              setPage(1);
            }}
            className="bg-gray-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-sm"
          >
            Clear
          </button>
        </div> */}
      {/* </div> */}

      {/* Main Table Section */}
      <div className="rounded-lg  py-3 text-white border  shadow-md shadow-white/30">
        <CustomTable
          tablehead={tablehead}
          tablerow={tablerow}
          isLoading={isLoading}
        />

        {/* Pagination */}
        <CustomToPagination page={page} setPage={setPage} data={allData} />
      </div>
    </div>
  );
};

export default ClaimTopUp;
