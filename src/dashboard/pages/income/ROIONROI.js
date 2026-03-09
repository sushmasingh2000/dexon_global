import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { useFormik } from "formik";
import moment from "moment";

const ROIONROI = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const initialValues = {
    income_Type: "",
    search: "",
    count: 100000000,
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
  });
  const { isLoading, data } = useQuery(
    ["roi_on_roi_income_api", page],
    () =>
      apiConnectorGet(`${endpoint?.roi_income_api}?income_type=ROI ON ROI&page=${page}`),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const allData = data?.data?.data || [];

  const tablehead = [
    <span>S.No.</span>,
    <span>Date</span>,
    <span>Amount ($)</span>,
    <span>Description</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>{moment(row.ledger_created_at)?.format("DD-MM-YYYY")}</span>,
      <span> {row.ledger_amount || "$0.00"}</span>,
      <span>{row.ledger_des || "N/A"}</span>,
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
        ROI ON ROI Income
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
              client.invalidateQueries(["get_roi"]);
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
        <div className="flex justify-end py-3 text-sm font-semibold text-green-400">
          Total Income : $ {allData?.totalAmount || 0}
        </div>

        {/* Pagination */}
        {/* <CustomToPagination page={page} setPage={setPage} data={allData} /> */}
      </div>
    </div>
  );
};

export default ROIONROI;
