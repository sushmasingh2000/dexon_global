import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { endpoint } from "../../../utils/APIRoutes";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import { apiConnectorPostAdmin } from "../../../utils/APIConnector";
import CustomTableSearch from "../../Shared/CustomTableSearch";

const P2PFundTransferHistory = () => {
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
      "p2p_fund_transfer_admin_history",
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
        sub_label: "FUND WALLET",
        main_label: "OUT",
        onlyP2PTransfer: true,
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching P2P transfer data:", err),
    }
  );

  const allData = data?.data?.result || [];

  const tablehead = [
    "S.No.",
    "Transaction",
    "Transfer Amount ($)",
    "Name",
    "Email",
    "From (Cust ID)",
    "To (Cust ID)",
    "Date/Time",
    "Status",
    "Description",
  ];

  const tablerow = allData?.data?.map((row, index) => [
    <span>{(page - 1) * (fk.values.count || 10) + index + 1}</span>,
    <span>{row?.tr07_trans_id}</span>,
    <span>{getFloatingValue(row.tr07_tr_amount)}</span>,
    <span>{row?.lgn_name}</span>,
    <span>{row?.lgn_email}</span>,
    <span className="font-medium text-blue-400">{row?.tr03_cust_id}</span>,
    <span className="font-medium text-yellow-400">{row?.tr07_description?.split(" ")?.[3]}</span>,
    <span>{formatedDate(moment, row?.tr07_created_at)}</span>,
    <span className="!text-green-600">Success</span>,
    <span>{row?.tr07_description}</span>,
  ]);

  return (
    <div className="p-2">
      <CustomTableSearch
        fk={fk}
        onClearFn={() => {
          setPage(1);
        }}
        onSubmitFn={() => {
          setPage(1);
          client.invalidateQueries(["p2p_fund_transfer_admin_history"]);
        }}
      />

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

        {/* Pagination */}
        <CustomToPagination page={page} setPage={setPage} data={allData} />
      </div>
    </div>
  );
};

export default P2PFundTransferHistory;