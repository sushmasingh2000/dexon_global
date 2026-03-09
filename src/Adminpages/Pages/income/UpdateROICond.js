import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { formatedDate, getFloatingValue } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import { Edit } from "@mui/icons-material";
import toast from "react-hot-toast";

const UpdateROICond = () => {
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
            "get_package_details",
            fk.values.search,
            fk.values.start_date,
            fk.values.end_date,
            fk.values.count,
            page,
        ],
        () =>
            apiConnectorGet(endpoint?.get_package_details, {
                search: fk.values.search,
                created_at: fk.values.start_date,
                updated_at: fk.values.end_date,
                page: page,
                count: fk.values.count,
                sub_label: "ROI",
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
        <span>Package ID</span>,
        <span>Package Name</span>,
        <span>Profit From </span>,
        <span>Profit To</span>,
        <span>Last Update</span>,
        <span>Action</span>,


    ];
    const tablerow = allData?.data?.map((row, index) => {
        return [
            <span> {row?.m05_id}</span>,
            <span> {row.m05_pkg_name}</span>,
            <span> {row.m05_profit}</span>,
            <span> {row.m05_profit1}</span>,
            <span>{formatedDate(moment, row.m05_updated_at)}</span>,
            <span>
                <Edit
                    onClick={() => {
                        return toast("Comming Soon!", {
                            id: 1
                        })
                    }}
                    sx={{ color: "#749df5", cursor: "pointer" }}
                    fontSize="medium"
                />
            </span>


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
                    client.invalidateQueries(["get_level_admin"]);
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

export default UpdateROICond;
