import { useFormik } from "formik";
import soment from "moment-timezone";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [loding, setLoding] = useState(false);
  const client = useQueryClient();
  const { data: profile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result || 0;

  const initialValues = {
    with_amount: "",
  };
  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        with_amount: amount,
      };
      Withdarwal(reqbody);
    },
  });
  async function Withdarwal(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.add_user_withdrawal,
        reqbody
      );
      toast(res?.data?.message);
      fk.handleReset();
      client.refetchQueries("get_withdrawal");
      client.refetchQueries("get_profile");
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }
  const [page, setPage] = useState(1);
  const initialValuesssss = {
    search: "",
    count: 10,
    created_at: "",
    updated_at: "",
  };

  const formik = useFormik({
    initialValues: initialValuesssss,
    enableReinitialize: true,
  });
  const { data, isLoading } = useQuery(
    [
      "get_withdrawal",
      formik.values.search,
      formik.values.created_at,
      formik.values.updated_at,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.withdrawal_list, {
        search: formik.values.search,
        created_at: formik.values.created_at,
        updated_at: formik.values.updated_at,
        page: page,
        count: 100000000000,
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const allData = data?.data?.data || [];
  const tablehead = [
    <span>S.No.</span>,
    <span>Date</span>,
    <span>Transaction Id</span>,
    <span>Amount ($)</span>,
    <span>Wallet Address</span>,
    <span>Status</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>
        {row?.wdrl_created_at
          ? soment(row?.wdrl_created_at)
              .tz("Asia/Kolkata")
              .format("DD-MM-YYYY HH:mm:ss")
          : "--"}
      </span>,
      <span>{row?.wdrl_transacton_id}</span>,
      <span> {row?.wdrl_amont || 0}</span>,
      <span>{row?.wdrl_to}</span>,
      <span>{row?.wdrl_status || "N/A"}</span>,
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
        Withdarwal Report
      </h2>

      {/* Filters */}
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
            name="created_at"
            id="created_at"
            value={formik.values.created_at}
            onChange={formik.handleChange}
            className="
            bg-white text-black
            rounded-md py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            w-full sm:w-auto
          "
          />

          <input
            type="date"
            name="updated_at"
            id="updated_at"
            value={formik.values.updated_at}
            onChange={formik.handleChange}
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
              client.invalidateQueries(["get_withdrawal"]);
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
              formik.handleReset();
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

        {/* Pagination */}
        {/* <CustomToPagination page={page} setPage={setPage} data={allData} /> */}
      </div>
    </div>
  );
};

export default Withdrawal;
