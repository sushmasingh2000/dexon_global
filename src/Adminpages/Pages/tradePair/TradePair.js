import { DeleteForever } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { areYouSureFn, formatedDate } from "../../../utils/utilityFun";

const TradePair = () => {
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
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
            "get_trade",
            fk.values.search,
            fk.values.start_date,
            fk.values.end_date,
            page,
        ],
        () =>
            apiConnectorPostAdmin(endpoint?.get_trade_api, {
                search: fk.values.search,
                created_at: fk.values.start_date,
                updated_at: fk.values.end_date,
                page: page,
                count: "10",
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

    const addFormik = useFormik({
        initialValues: {
            pair_name: "",
            status: 1,
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await apiConnectorPostAdmin(
                    endpoint?.create_trade_pair_api,
                    values
                );
                toast(res?.data?.message)
                if (res?.data?.success) {
                    setShowModal(false);
                    resetForm();
                    client.invalidateQueries(["get_trade"]);
                }
            } catch (error) {
                console.error("Create Trade Pair Error:", error);
            }
        },
    });

    const StatusFn = async (id, status) => {
        try {
            const res = await apiConnectorPostAdmin(
                endpoint?.update_trade_pair_api, {
                id: id,
                status: status
            }

            );
            toast(res?.data?.message)
            if (res?.data?.success) {
                client.invalidateQueries(["get_trade"]);
            }
        } catch (error) {
            console.error("Create Trade Pair Error:", error);
        }
    }
    const DeleteFn = async (id,) => {
        try {
            const res = await apiConnectorPostAdmin(
                endpoint?.delete_trade_pair_api, {
                id: id,
            }
            );
            toast(res?.data?.message)
            if (res?.data?.success) {
                client.invalidateQueries(["get_trade"]);
            }
        } catch (error) {
            console.error("Create Trade Pair Error:", error);
        }
    }

    const tablehead = [
        "S.No.",
        "Pairs",
        "Status",
        "Date/Time",
        "Action"
    ];
    const tablerow = allData?.data?.map((row, index) => {
        return [
            <span>{(page - 1) * (fk.values.count || 10) + index + 1}</span>,
            <span>{row?.m07_pair_name}</span>,
            <span className={row?.m07_status === 0 ? "text-red-500" : "text-green-500"}>
                <Switch
                    checked={row?.m07_status === 1}
                    onChange={() => 
                        StatusFn(row?.m07_td_id)}
                />
                {row?.m07_status === 0 ? "InActive" : "Active"}
            </span>,
            <span>{formatedDate(moment, row?.m07_created_at)}</span>,

            <span><DeleteForever className="!text-red-600"
                onClick={() => {
                    areYouSureFn(Swal, ()=>DeleteFn(row?.m07_td_id), {})
                }}
            /></span>,
        ];
    });

    return (
        <div className="p-2">
            {/* <div className="bg-gray-800 rounded-lg shadow-lg p-3 text-white border border-gray-700 mb-6"> */}
          
            <div className="flex justify-end mb-3">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#50c1db] text-white px-4 py-2 rounded-md font-semibold"
                >
                    + Add Trade Pair
                </button>
            </div>
            {/* <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base">
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={fk.values.start_date}
            onChange={fk.handleChange}
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={fk.values.end_date}
            onChange={fk.handleChange}
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
         
          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_actiavtion"]);
            }}
            type="submit"
            className="bg-gold-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-dark-color transition-colors w-full sm:w-auto text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              fk.handleReset();
              setPage(1);
            }}
            className="bg-gray-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-sm"
          >
            Clear
          </button>
        </div> */}
            {/* </div> */}

            {/* Main Table Section */}
            <div className="rounded-lg  py-3 text-white border  shadow-md shadow-white/30">
                <CustomTable
                    tablehead={tablehead}
                    tablerow={tablerow}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                <CustomToPagination page={page} setPage={setPage} data={allData} />
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-white">
                            Add Trade Pair
                        </h3>

                        <form onSubmit={addFormik.handleSubmit}>
                            {/* Pair Name */}
                            <div className="mb-3">
                                <label className="text-sm text-gray-300">Pair Name</label>
                                <input
                                    type="text"
                                    name="pair_name"
                                    value={addFormik.values.pair_name}
                                    onChange={addFormik.handleChange}
                                    className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    required
                                />
                            </div>

                            {/* Status */}
                            {/* <div className="mb-4">
                                <label className="text-sm text-gray-300">Status</label>
                                <select
                                    name="status"
                                    value={addFormik.values.status}
                                    onChange={addFormik.handleChange}
                                    className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div> */}

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-gold-color text-black px-4 py-2 rounded-md font-semibold"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradePair;
