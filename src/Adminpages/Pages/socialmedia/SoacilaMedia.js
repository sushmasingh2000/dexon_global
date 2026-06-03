import { DeleteForever, Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorGetAdmin, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn } from "../../../utils/utilityFun";

const SocialMedia = () => {
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null); // null = create, object = edit
    const [isSubmitting, setIsSubmitting] = useState(false);
    const client = useQueryClient();

    // ─── Fetch all ──────────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery(
        ["get_social_media", page],
        () =>
            apiConnectorGetAdmin(endpoint?.get_all_social_media_api, {
                page,
                count: "10",
            }),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: (err) => console.error("Social Media fetch error:", err),
        }
    );

    const allData = data?.data?.result || [];

    // ─── Form ───────────────────────────────────────────────────────────────────
    const formik = useFormik({
        initialValues: {
            m09_soc_name: editData?.m09_soc_name || "",
            m09_soc_url: editData?.m09_soc_url || "",
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
                let res;
                if (editData) {
                    // UPDATE
                    res = await apiConnectorPostAdmin(
                        endpoint?.update_social_media_api,
                        { id: editData.m09_id, ...values }
                    );
                } else {
                    // CREATE
                    res = await apiConnectorPostAdmin(
                        endpoint?.create_social_media_api,
                        values
                    );
                }
                toast(res?.data?.message);
                if (res?.data?.success) {
                    resetForm();
                    setShowModal(false);
                    setEditData(null);
                    client.invalidateQueries(["get_social_media"]);
                }
            } catch (err) {
                console.error("Social Media submit error:", err);
                toast.error("Something went wrong.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // ─── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            const res = await apiConnectorPostAdmin(
                endpoint?.delete_social_media_api,
                { id }
            );
            toast(res?.data?.message);
            if (res?.data?.success) {
                client.invalidateQueries(["get_social_media"]);
            }
        } catch (err) {
            console.error("Social Media delete error:", err);
        }
    };

    const openCreate = () => {
        setEditData(null);
        formik.resetForm();
        setShowModal(true);
    };

    const openEdit = (row) => {
        setEditData(row);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditData(null);
        formik.resetForm();
    };

    // ─── Table ──────────────────────────────────────────────────────────────────
    const tablehead = ["S.No.", "Platform Name", "URL", "Action"];

    const tablerow = allData?.map((row, index) => [
        <span>{(page - 1) * 10 + index + 1}</span>,

        <span className="flex items-center gap-2">
            <span className="text-white font-medium">{row?.m09_soc_name || "-"}</span>
        </span>,

        <a
            href={row?.m09_soc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#50c1db] hover:underline text-sm truncate max-w-xs block"
        >
            {row?.m09_soc_url || "-"}
        </a>,

        <span className="flex items-center gap-3">
            <Edit
                className="!text-blue-400 cursor-pointer hover:!text-blue-300 transition-colors"
                onClick={() => openEdit(row)}
            />
            <DeleteForever
                className="!text-red-500 cursor-pointer hover:!text-red-400 transition-colors"
                onClick={() =>
                    areYouSureFn(Swal, () => handleDelete(row?.m09_id), {})
                }
            />
        </span>,
    ]);

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="p-2">
            {/* Header */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={openCreate}
                    className="bg-[#50c1db] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#3aaecc] transition-colors"
                >
                    + Add Social Media
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg py-3 text-white border shadow-md shadow-white/30">
                <CustomTable
                    tablehead={tablehead}
                    tablerow={tablerow}
                    isLoading={isLoading}
                />
                <CustomToPagination page={page} setPage={setPage} data={allData} />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-[420px] shadow-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-5 text-white">
                            {editData ? "Edit Social Media" : "Add Social Media"}
                        </h3>

                        <form onSubmit={formik.handleSubmit}>
                            {/* Platform Name */}
                            <div className="mb-4">
                                <label className="text-sm text-gray-300 block mb-1">
                                    Platform Name
                                </label>
                                <input
                                    type="text"
                                    name="m09_soc_name"
                                    value={formik.values.m09_soc_name}
                                    onChange={formik.handleChange}
                                    placeholder="e.g. Facebook, Twitter, Instagram"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#50c1db]"
                                    required
                                />
                            </div>

                            {/* URL */}
                            <div className="mb-5">
                                <label className="text-sm text-gray-300 block mb-1">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    name="m09_soc_url"
                                    value={formik.values.m09_soc_url}
                                    onChange={formik.handleChange}
                                    placeholder="https://facebook.com/yourpage"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#50c1db]"
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#50c1db] hover:bg-[#3aaecc] disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                                >
                                    {isSubmitting
                                        ? editData ? "Updating..." : "Saving..."
                                        : editData ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialMedia;