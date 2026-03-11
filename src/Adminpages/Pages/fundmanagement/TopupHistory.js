import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";

const TopupHistory = () => {
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
      "topup_history_admin",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPostAdmin(endpoint?.get_report_details, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: "10",
        sub_label: "TOPUP WALLET",
        main_label: "IN"
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
    "Amount ($)",
    "Name",
    "Email",
    "Cust Id",
    "Date/Time",
    "Status",
    "Description",
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span>{index + 1}</span>,
      <span>{row?.tr07_trans_id}</span>,
      <span>{getFloatingValue(row.tr07_tr_amount)}</span>,
      <span>{row?.lgn_name}</span>,
      <span>{row?.lgn_email}</span>,
      <span>{row?.tr03_cust_id}</span>,
      <span>{formatedDate(moment, row?.tr07_created_at)}</span>,
      <span className="!text-green-600">Success</span>,
      <span>{row?.tr07_description}</span>,
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
          client.invalidateQueries(["topup_history_admin"]);
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
          isLoading={isLoading }
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

export default TopupHistory;
