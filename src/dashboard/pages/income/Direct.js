import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";

const Direct = () => {
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
      "get_direct_income",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.get_report_details, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: fk.values.count,
        sub_label: "DIRECT",
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
    <span>S.No.</span>,
    <span>Transaction</span>,
    <span>Date</span>,
    <span>Amount ($)</span>,
    <span>Description</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span> {row.tr07_trans_id}</span>,
      <span>{formatedDate(moment, row.tr07_created_at)}</span>,
      <span> {getFloatingValue(row.tr07_tr_amount)}</span>,
      <span>{row.tr07_description || "N/A"}</span>,
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
        Referral Bonus
      </h2>

      {/* <div
        className="
        bg-black rounded-lg
        border border-gray-700
        p-4 mb-4
        shadow-md shadow-white/20
        text-white
      "
      >
        <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 w-full text-sm">
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={fk.values.start_date}
            onChange={fk.handleChange}
            className="
            bg-white text-black
            rounded-md py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            w-full sm:w-auto
          "
          />

          <input
            type="date"
            name="end_date"
            id="end_date"
            value={fk.values.end_date}
            onChange={fk.handleChange}
            className="
            bg-white text-black
            rounded-md py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            w-full sm:w-auto
          "
          />

          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_direct"]);
            }}
            type="submit"
            className="
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            py-2 px-5 rounded-md
            transition w-full sm:w-auto
          "
          >
            Search
          </button>

          <button
            onClick={() => {
              fk.handleReset();
              setPage(1);
            }}
            className="
            bg-gray-600 hover:bg-black
            text-white font-semibold
            py-2 px-5 rounded-md
            transition w-full sm:w-auto
          "
          >
            Clear
          </button>
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

export default Direct;
