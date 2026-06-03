import { DeleteForever } from "@mui/icons-material";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorGetAdmin, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { domain, endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn, formatedDate } from "../../../utils/utilityFun";
import moment from "moment";


const WebPopup = () => {
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [popupType, setPopupType] = useState("image");
    const [selectedFile, setSelectedFile] = useState(null);
    const [textContent, setTextContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const client = useQueryClient();

    // ─── Fetch all popups ───────────────────────────────────────────────────────
    const { data, isLoading } = useQuery(
        ["get_web_popup", page],
        () =>
            apiConnectorGetAdmin(endpoint?.get_all_web_popup_api, {
                page: page,
                count: "10",
            }),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: (err) => console.error("Error fetching web popups:", err),
        }
    );

    const allData = data?.data?.result || [];

    // ─── Reset modal form ───────────────────────────────────────────────────────
    const resetForm = () => {
        setPopupType("image");
        setSelectedFile(null);
        setTextContent("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openModal = () => { resetForm(); setShowModal(true); };
    const closeModal = () => { setShowModal(false); resetForm(); };

    const handleTypeChange = (type) => {
        setPopupType(type);
        setSelectedFile(null);
        setTextContent("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getAccept = () => {
        if (popupType === "image") return "image/*";
        if (popupType === "video") return "video/*";
        return "";
    };

    // ─── Create popup ───────────────────────────────────────────────────────────
    const handleCreate = async () => {
        if (popupType !== "text" && !selectedFile) {
            toast.error("Please select a file to upload.");
            return;
        }
        if (popupType === "text" && !textContent.trim()) {
            toast.error("Please enter text content.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            // isFile must be "image", "video", or "text"
            formData.append("isFile", popupType);
            // item = text content for text type, or file path handled by backend for file types
            if (popupType !== "text") {
                formData.append("item", popupType);
                formData.append("file", selectedFile);
            } else {
                formData.append("item", textContent.trim());
            }

            const res = await apiConnectorPostAdmin(
                endpoint?.create_web_popup_api,
                formData
            );

            toast(res?.data?.message);
            if (res?.data?.success) {
                closeModal();
                client.invalidateQueries(["get_web_popup"]);
            }
        } catch (error) {
            console.error("Create Web Popup Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Delete popup ───────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            const res = await apiConnectorPostAdmin(
                endpoint?.delete_web_popup_api,
                { id }
            );
            toast(res?.data?.message);
            if (res?.data?.success) {
                client.invalidateQueries(["get_web_popup"]);
            }
        } catch (error) {
            console.error("Delete Web Popup Error:", error);
        }
    };

    // ─── Table config ────────────────────────────────────────────────────────────
    const tablehead = ["S.No.", "Type", "Preview / Content", "Date/Time", "Action"];

    const tablerow = allData?.map((row, index) => {
        // Derive type from DB flags
        const type =
            row?.m08_image_file === 1
                ? "image"
                : row?.m08_video_file === 1
                ? "video"
                : "text";

        const typeColor =
            type === "image"
                ? "text-blue-400"
                : type === "video"
                ? "text-purple-400"
                : "text-green-400";

        return [
            <span>{(page - 1) * 10 + index + 1}</span>,

            <span className={`font-semibold capitalize ${typeColor}`}>
                {type}
            </span>,

            <span className="text-gray-300">
                {type === "text" ? (
                    <span className="text-sm">{row?.m08_item || "-"}</span>
                ) : type === "image" ? (
                    <img
                        src={`${domain}${row?.m08_item}`}
                        alt="popup"
                        className="w-14 h-10 object-cover rounded border border-gray-600"
                    />
                ) : (
                    <span className="text-xs text-gray-400 break-all">
                        {row?.m08_item}
                    </span>
                )}
            </span>,

            <span>{formatedDate(moment, row?.m08_created_at)}</span>,

            <span>
                <DeleteForever
                    className="!text-red-500 cursor-pointer hover:!text-red-400 transition-colors"
                    onClick={() =>
                        areYouSureFn(Swal, () => handleDelete(row?.m08_wp_id), {})
                    }
                />
            </span>,
        ];
    });

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="p-2">
            {/* Header */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={openModal}
                    className="bg-[#50c1db] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#3aaecc] transition-colors"
                >
                    + Add Popup
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
                            Add Web Popup
                        </h3>

                        {/* Type Selection */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-300 block mb-2">
                                Popup Type
                            </label>
                            <div className="flex gap-3">
                                {["image", "video", "text"].map((type) => (
                                    <label
                                        key={type}
                                        className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border transition-all ${
                                            popupType === type
                                                ? "border-[#50c1db] bg-[#50c1db]/10 text-[#50c1db]"
                                                : "border-gray-600 text-gray-300 hover:border-gray-400"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="popupType"
                                            value={type}
                                            checked={popupType === type}
                                            onChange={() => handleTypeChange(type)}
                                            className="hidden"
                                        />
                                        <span className="capitalize font-medium text-sm">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* File Upload */}
                        {popupType !== "text" && (
                            <div className="mb-4">
                                <label className="text-sm text-gray-300 block mb-2">
                                    Upload {popupType.charAt(0).toUpperCase() + popupType.slice(1)}
                                </label>
                                <div
                                    className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center cursor-pointer hover:border-[#50c1db] transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {selectedFile ? (
                                        <div className="text-sm text-gray-300">
                                            <p className="text-[#50c1db] font-medium truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-gray-500 mt-1">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </p>
                                            {popupType === "image" && (
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="preview"
                                                    className="mt-2 mx-auto max-h-24 rounded object-contain"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            <p className="text-3xl mb-1">📁</p>
                                            <p className="text-sm">
                                                Click to choose{" "}
                                                {popupType === "image"
                                                    ? "image (jpg, png, gif, webp)"
                                                    : "video (mp4, webm, mov)"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={getAccept()}
                                    className="hidden"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files?.[0] || null)
                                    }
                                />
                            </div>
                        )}

                        {/* Text Input */}
                        {popupType === "text" && (
                            <div className="mb-4">
                                <label className="text-sm text-gray-300 block mb-2">
                                    Text Content
                                </label>
                                <textarea
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    rows={4}
                                    placeholder="Enter popup text content here..."
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#50c1db]"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={isSubmitting}
                                className="bg-[#50c1db] hover:bg-[#3aaecc] disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebPopup;