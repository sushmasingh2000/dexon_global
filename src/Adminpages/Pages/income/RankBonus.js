import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";

const RankBonus = () => {
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
      "get_rank_bonus",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      fk.values.count,
      page,
    ],
    () =>
      apiConnectorPostAdmin(endpoint?.get_report_details, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: fk.values.count,
        sub_label: "RANK",
        main_label: "IN"
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching rank bonus data:", err),
    }
  );

  const allData = data?.data?.result || [];

  const tablehead = [
    <span>S.No.</span>,
    <span>Transaction</span>,
    <span>Date</span>,
    <span>Amount ($)</span>,
    // <span>Name</span>,
    // <span>Customer Id</span>,
    <span>Description</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {(page - 1) * (fk.values.count || 10) + index + 1}</span>,
      <span> {row.tr07_trans_id}</span>,
      <span>{formatedDate(moment, row.tr07_created_at)}</span>,
      <span> {getFloatingValue(row.tr07_tr_amount)}</span>,
      // <span>{row.lgn_name || "N/A"}</span>,
      // <span>{row.tr03_cust_id || "N/A"}</span>,
      <span>{row.tr07_description || "N/A"}</span>,
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
          client.invalidateQueries(["get_rank_bonus"]);
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
          isLoading={isLoading}
        />

        {/* Total Income */}
        {/* <div className="flex justify-end py-3 text-sm font-semibold text-green-400">
          Total Income : $ {allData?.totalAmount || 0}
        </div> */}

        {/* Pagination */}
        <CustomToPagination page={page} setPage={setPage} data={allData}
          count={fk.values.count}
          onCountChange={(value) => {
            fk.setFieldValue("count", value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default RankBonus;
