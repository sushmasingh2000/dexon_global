import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorGet, apiConnectorGetAdmin, apiConnectorPost, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn, formatedDate } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import Swal from "sweetalert2";

const NewsAndUpdated = () => {
    const [page, setPage] = useState(1);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);
    const [newsInput, setNewsInput] = useState("");
    const [selectedNewsRow, setSelectedNewsRow] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
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
            "get_news_and_updates",
            fk.values.search,
            fk.values.start_date,
            fk.values.end_date,
            page,
        ],
        () =>
            apiConnectorGetAdmin(endpoint?.get_news_and_updates, {
                search: fk.values.search,
                created_at: fk.values.start_date,
                updated_at: fk.values.end_date,
                page: page,
                count: fk.values.count,

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



    const handleOpenNewsDialog = (row) => {
        setSelectedNewsRow(row);
        setNewsInput(row?.m01_nw_news || "");
        setOpenNewsDialog(true);
    };

    const handleUpdateNews = async () => {
        if (!newsInput?.trim()) {
            toast.error("Please enter news.");
            return;
        }

        if (!endpoint?.update_news_and_updates) {
            toast.error("Update news API is not configured.");
            return;
        }

        setUpdateLoading(true);
        try {
            const reqbody = {
                id: selectedNewsRow?.m01_nw_id,
                news: newsInput?.trim(),
            };
            const res = await apiConnectorPostAdmin(endpoint?.update_news_and_updates, reqbody);
            toast.success(res?.data?.message || "News updated successfully.");
            setOpenNewsDialog(false);
            setSelectedNewsRow(null);
            setNewsInput("");
            client.invalidateQueries(["get_news_and_updates"]);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update news.");
        }
        setUpdateLoading(false);
    };

    const handleNewsStatus = async (row) => {
        const id = row?.m01_nw_id;
        if (!id) {
            toast.error("Invalid news id.");
            return;
        }
        setUpdateLoading(true);
        try {
            const reqbody = {
                id,
            };
            const res = await apiConnectorPostAdmin(endpoint?.update_news_and_updates_status, reqbody);
            toast.success(res?.data?.message || "News status updated.");
            client.invalidateQueries(["get_news_and_updates"]);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update news status.");
        }
        setUpdateLoading(false);
    };

    const tablehead = [
        <span>S.No.</span>,
        <span>News</span>,
        <span>Date</span>,
        <span>Edit</span>,
        <span>Action</span>,
    ];
    const tablerow = allData?.map((row, index) => {
        return [
            <span> {(page - 1) * (fk.values.count || 10) + index + 1}</span>,
            <span> {row.m01_nw_news}</span>,
            <span>{formatedDate(moment, row.m01_nw_created_at)}</span>,
            <button
                type="button"
                onClick={() => handleOpenNewsDialog(row)}
                className="px-3 py-1 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors !text-white"
            >
                Edit
            </button>,
            <label className="inline-flex items-center cursor-pointer gap-2">
                <input
                    type="checkbox"
                    checked={row?.m01_nw_status === 1}
                    onChange={() => handleNewsStatus(row)}
                    // disabled={statusUpdatingId === row?.m01_nw_id}
                    className="sr-only peer"
                />
                <div className="relative w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-cyan-600 transition-colors">
                    <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                </div>
                <span className="text-xs text-gray-300">
                    {row?.m01_nw_status === 1 ? "Active" : "Inactive"}
                </span>
            </label>,
        ];
    });
    return (
        <div className="p-2">


            {/* <CustomTableSearch
                fk={fk}
                onClearFn={() => {
                    setPage(1);
                }}
                onSubmitFn={() => {
                    setPage(1);
                    client.invalidateQueries(["get_news_and_updates"]);
                }} /> */}

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
                {/* <CustomToPagination page={page} setPage={setPage} data={allData} /> */}
            </div>

            {openNewsDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-md rounded-lg border border-gray-700 bg-[#0f0f0f] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-white">Update News</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenNewsDialog(false);
                                    setSelectedNewsRow(null);
                                    setNewsInput("");
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-300">Enter News</label>
                            <textarea
                                rows={4}
                                value={newsInput}
                                onChange={(e) => setNewsInput(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                                placeholder="Enter news"
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenNewsDialog(false);
                                    setSelectedNewsRow(null);
                                    setNewsInput("");
                                }}
                                className="px-4 py-2 rounded-md text-sm bg-gray-700 hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => areYouSureFn(Swal, () => handleUpdateNews())}
                                disabled={updateLoading}
                                className="px-4 py-2 rounded-md text-sm bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60"
                            >
                                {updateLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsAndUpdated;
