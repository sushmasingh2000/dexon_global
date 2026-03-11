import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn, formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import Swal from "sweetalert2";

const PayoutReport = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
      apiConnectorPostAdmin(endpoint?.member_payout_report, {
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
    "Name",
    "Email",
    "Cust Id",
    "Request Amount ($)",
    "Charges ($)",
    "Net Amount ($)",
    "Status",
    "Action",
    "Wallet Type",
    "Wallet Address",
    "Hash"
  ];

  const handlePayoutAction = async (row, action) => {
    setLoading(true);
    try {

      const reqBody = {
        t_id: row?.tr11_id,
        status_type: action
      }
      const apiRes = await apiConnectorPostAdmin(endpoint?.withdrawal_approval_from_admin, reqBody);
      if (apiRes?.data?.status) {
        Swal.fire({
          title: "Success",
          text: apiRes?.data?.message || "Action performed successfully!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: apiRes?.data?.message || "Something went wrong!",
          // icon: "error",
        });
      }
      client.invalidateQueries(["get_payout_report"]);
    } catch (err) {
      console.error("Error handling payout action:", err);
    }
    setLoading(false);
  };

  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span>{index + 1}</span>,
      <span>{row?.tr11_transacton_id}</span>,
      <span>{formatedDate(moment, row?.tr11_created_at)}</span>,
      <span>{row?.lgn_name}</span>,
      <span>{row?.lgn_email}</span>,
      <span>{row?.tr03_cust_id}</span>,
      <span>{getFloatingValue(row.tr11_amont)}</span>,
      <span>{getFloatingValue(row.tr11_charges)}</span>,
      <span>{getFloatingValue(row.tr11_net_amnt)}</span>,
      <span className={`
        ${row?.tr11_status === "Pending" ? "text-yellow-500" : row?.tr11_status === "Success" ? "text-green-500" : row?.tr11_status === "Failed" ? "text-red-500" : ""}
       `
      } >{row?.tr11_status}</span>,
      <span className="flex gap-2">
        {row?.tr11_status === "Pending" && row?.tr11_wallet_type === "Capital Wallet" ? (
          <>
            <button
              className="px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition"
              onClick={() => areYouSureFn(Swal, () => handlePayoutAction(row, 'Success'))}
            >Accept</button>
            <button
              className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
              onClick={() => areYouSureFn(Swal, () => handlePayoutAction(row, 'Reject'))}
            >Reject</button>
          </>
        ) : (
          <>
            <button
              className="px-2 py-1 rounded bg-gray-400 text-white text-xs font-semibold cursor-not-allowed opacity-60"
              disabled
            >Accept</button>
            <button
              className="px-2 py-1 rounded bg-gray-400 text-white text-xs font-semibold cursor-not-allowed opacity-60"
              disabled
            >Reject</button>
          </>
        )}
      </span>,
      <span className="!text-white">{row?.tr11_wallet_type}</span>,
      <span className="!text-gold-color">{row?.tr11_payout_to}</span>,
      <span className="!text-blue-600 underline cursor-pointer"
        onClick={() => window.open(`https://bscscan.com/tx/${row?.tr11_hash}`, "_blank")}
      >{row?.tr11_hash ? row?.tr11_hash?.substring(0, 10) : "--"}...</span>
    ];
  });

  return (
    <div className="p-2">


      <CustomTableSearch
        fk={fk}
        onClearFn={() => {
          setPage(1);
        }}
        onSubmitFn={() => {
          setPage(1);
          client.invalidateQueries(["get_level_admin"]);
        }} />

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
          isLoading={isLoading || loading}
        />

        {/* Total Income */}
        {/* <div className="flex justify-end py-3 text-sm font-semibold text-green-400">
          Total Income : $ {allData?.totalAmount || 0}
        </div> */}

        {/* Pagination */}
        <CustomToPagination page={page} setPage={setPage} data={allData} />
      </div>
    </div>
  );
};

export default PayoutReport;
