import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorGet, apiConnectorGetAdmin, apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import { Edit } from "@mui/icons-material";
import toast from "react-hot-toast";

const UpdateROICond = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [profitFrom, setProfitFrom] = useState("");
  const [profitTo, setProfitTo] = useState("");

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
      "get_package_details",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      fk.values.count,
      page,
    ],
    () =>
      apiConnectorGetAdmin(endpoint?.get_package_details, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
        page: page,
        count: fk.values.count,
        sub_label: "ROI",
        main_label: "IN",
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

  // Open modal and pre-fill values
  function openEdit(row) {
    setSelectedRow(row);
    setProfitFrom(row.m05_profit ?? "");
    setProfitTo(row.m05_profit1 ?? "");
    setEditModal(true);
  }

  function closeEdit() {
    setEditModal(false);
    setSelectedRow(null);
    setProfitFrom("");
    setProfitTo("");
  }

  async function handleUpdate() {
    if (profitFrom === "" || profitTo === "") {
      toast.error("Please fill both Profit From and Profit To.");
      return;
    }
    if (parseFloat(profitFrom) > parseFloat(profitTo)) {
      toast.error("Profit From cannot be greater than Profit To.");
      return;
    }

    setEditLoading(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.update_trade_profit, {
        m05_id: selectedRow?.m05_id,
        m05_profit: profitFrom,
        m05_profit1: profitTo,
      });

      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Updated successfully!");
        client.invalidateQueries(["get_package_details"]);
        closeEdit();
      } else {
        toast.error(res?.data?.message || "Update failed.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
    }
    setEditLoading(false);
  }

  const tablehead = [
    <span>Package ID</span>,
    <span>Package Name</span>,
    <span>Profit From</span>,
    <span>Profit To</span>,
    <span>Last Update</span>,
    <span>Action</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span>{row?.m05_id}</span>,
      <span>{row.m05_pkg_name}</span>,
      <span>{row.m05_profit}</span>,
      <span>{row.m05_profit1}</span>,
      <span>{formatedDate(moment, row.m05_updated_at)}</span>,
      <span>
        <Edit
          onClick={() => openEdit(row)}
          sx={{ color: "#749df5", cursor: "pointer" }}
          fontSize="medium"
        />
      </span>,
    ];
  });

  return (
    <div className="p-2">
      <CustomTableSearch
        fk={fk}
        onClearFn={() => setPage(1)}
        onSubmitFn={() => {
          setPage(1);
          client.invalidateQueries(["get_package_details"]);
        }}
      />

      {/* Table Section */}
      <div className="rounded-lg py-3 text-white bg-black border border-gray-700 shadow-md shadow-white/20">
        <CustomTable
          tablehead={tablehead}
          tablerow={tablerow}
          isLoading={isLoading}
        />
        <CustomToPagination
          page={page}
          setPage={setPage}
          data={allData}
          count={fk.values.count}
          onCountChange={(value) => {
            fk.setFieldValue("count", value);
            setPage(1);
          }}
        />
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div className="w-full max-w-sm bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-400/20 relative">

            {/* Accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-l-2xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-cyan-400 font-bold text-lg">Edit ROI Condition</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Package: <span className="text-cyan-300 font-semibold">{selectedRow?.m05_pkg_name}</span>
                  &nbsp;·&nbsp;ID: <span className="text-cyan-300 font-semibold">{selectedRow?.m05_id}</span>
                </p>
              </div>
              <button
                onClick={closeEdit}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>

            {/* Profit From */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Profit From (%)
              </label>
              <input
                type="number"
                value={profitFrom}
                onChange={(e) => setProfitFrom(e.target.value)}
                placeholder="e.g. 1.5"
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold placeholder:text-gray-500"
              />
            </div>

            {/* Profit To */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Profit To (%)
              </label>
              <input
                type="number"
                value={profitTo}
                onChange={(e) => setProfitTo(e.target.value)}
                placeholder="e.g. 3.0"
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 font-semibold placeholder:text-gray-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeEdit}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={editLoading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateROICond;