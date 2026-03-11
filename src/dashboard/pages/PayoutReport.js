import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";
import { formatedDate, getFloatingValue } from "../../utils/utilityFun";

const PayoutReport = () => {
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
      "get_payout_report",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.member_payout_report, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: "10",
        // sub_label: "FUND WALLET",
        // main_label: "IN"
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

  const tablehead = [
    "S.No.",
    "Transaction",
    "Request Date",
    "Wallet Type",
    "Request Amount ($)",
    "Charges ($)",
    "Net Amount ($)",
    "Status",
    "Wallet Address",
    "Hash"
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span>{index + 1}</span>,
      <span>{row?.tr11_transacton_id}</span>,
      <span>{formatedDate(moment, row?.tr11_created_at)}</span>,
      <span>{row.tr11_wallet_type}</span>,
      <span>{getFloatingValue(row.tr11_amont)}</span>,
      <span>{getFloatingValue(row.tr11_charges)}</span>,
      <span>{getFloatingValue(row.tr11_net_amnt)}</span>,
      <span className={`
        ${row?.tr11_status === "Pending" ? "text-yellow-500" : row?.tr11_status === "Success" ? "text-green-500" : row?.tr11_status === "Failed" ? "text-red-500" : ""}
       `
      } >{row?.tr11_status}</span>,
      <span className="!text-gold-color">{row?.tr11_payout_to}</span>,
      <span className="!text-blue-600 underline cursor-pointer"
        onClick={() => window.open(`https://bscscan.com/tx/${row?.tr11_hash}`, "_blank")}
      >{row?.tr11_hash ? row?.tr11_hash?.substring(0, 10) : "--"}...</span>
    ];
  });

  return (
    <div className="p-2">
      {/* <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white border border-gray-700 mb-6"> */}
      <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center shadow-md shadow-white/30 px-4 py-2 rounded-md ">
        Fund Withdrawal History
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

export default PayoutReport;
