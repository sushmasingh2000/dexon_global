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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const TeamAndMembers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      "get_member_list",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      fk.values.count,
      page,
    ],
    () =>
      apiConnectorPostAdmin(endpoint?.member_list, {
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

  async function showBusiness(userId) {
    setLoading(true);
    try {
      const { data } = await apiConnectorGetAdmin(endpoint?.user_dashboard_business_api, { userId: userId });
      const directBusines = getFloatingValue(data?.result?.direct_business)
      const TeamBusines = getFloatingValue(data?.result?.team_business)
      Swal.fire({
        title: '<span style="color:#22d3ee;font-weight:700;font-size:1.2rem;">Total Business</span>',
        html: `
          <div style="display:flex;gap:1.5rem;justify-content:center;align-items:center;margin-top:1rem;">
            <div style="background:linear-gradient(135deg,#0a192f 60%,#22d3ee 100%);border-radius:1rem;padding:1.2rem 2.2rem;box-shadow:0 4px 24px #22d3ee33;display:flex;flex-direction:column;align-items:center;">
              <div style="font-size:0.9rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Direct Business</div>
              <div style="font-size:1.3rem;color:#22d3ee;font-weight:700;margin-top:0.2rem;">$${directBusines}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#38bdf8 100%);border-radius:1rem;padding:1.2rem 2.2rem;box-shadow:0 4px 24px #38bdf833;display:flex;flex-direction:column;align-items:center;">
              <div style="font-size:0.9rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Team Business</div>
              <div style="font-size:1.3rem;color:#38bdf8;font-weight:700;margin-top:0.2rem;">$${TeamBusines}</div>
            </div>
          </div>
        `,
        background: '#101827',
        icon: 'info',
        confirmButtonColor: '#22d3ee',
        customClass: {
          popup: 'swal2-card-theme',
          title: 'swal2-title-theme',
        },
        confirmButtonText: 'OK',
      });

    } catch (error) {
      console.error("Error fetching business data:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch business data. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    setLoading(false);
  }
  const tablehead = [
    <span>S.No.</span>,
    <span>Email</span>,
    <span>Customer Id</span>,
    <span>Name</span>,
    <span>View Team</span>,
    <span>View Tree</span>,
    <span>Business</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {(page - 1) * (fk.values.count || 10) + index + 1}</span>,
      <span> {row.lgn_email}</span>,
      <span> {row.lgn_cust_id}</span>,
      <span>{row.lgn_name || "N/A"}</span>,

      <span
        onClick={() => navigate("/downlineTeam", {
          state: {
            userId: row.tr03_reg_id
          }
        })}
      ><VisibilityIcon /></span>,
      <span
        onClick={() => navigate("/downlineTree", {
          state: {
            userId: row.tr03_reg_id
          }
        })}
      ><VisibilityIcon /></span>,
      <span
        onClick={() => showBusiness(row.tr03_reg_id)}
      ><VisibilityIcon /></span>
    ]
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
          client.invalidateQueries(["get_member_list"]);
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
          isLoading={isLoading || loading}
        />

        {/* Total Income */}
        {/* <div className="flex justify-end py-3 text-sm font-semibold text-green-400">
          Total Income : $ {allData?.totalAmount || 0}
        </div> */}

        {/* Pagination */}
        <CustomToPagination page={page} setPage={setPage} data={allData} count={fk.values.count}
          onCountChange={(value) => {
            fk.setFieldValue("count", value);
            setPage(1);
          }} />
      </div>
    </div>
  );
};

export default TeamAndMembers;
