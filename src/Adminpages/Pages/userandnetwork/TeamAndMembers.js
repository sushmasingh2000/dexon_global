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
      const result = data?.result || {};
      const currentRank = result?.current_rank ?? 0;
      const directMembers = getFloatingValue(result?.dir_mem || 0);
      const teamMembers = getFloatingValue(result?.team_mem || 0);
      const directBusiness = getFloatingValue(result?.direct_business || 0);
      const teamBusiness = getFloatingValue(result?.team_business || 0);
      const fLegBusiness = getFloatingValue(result?.fleg_buss || 0);
      const oLegBusiness = getFloatingValue(result?.oleg_buss || 0);

      
      Swal.fire({
        title: '<span style="color:#22d3ee;font-weight:700;font-size:1.2rem;">User Business Details</span>',
        html: `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-top:1rem;">
            <div style="background:linear-gradient(135deg,#0a192f 60%,#22d3ee 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #22d3ee33;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Current Rank</div>
              <div style="font-size:1.1rem;color:#22d3ee;font-weight:700;margin-top:0.2rem;">${currentRank}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#38bdf8 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #38bdf833;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Direct Members</div>
              <div style="font-size:1.1rem;color:#38bdf8;font-weight:700;margin-top:0.2rem;">${directMembers}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#06b6d4 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #06b6d433;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Team Members</div>
              <div style="font-size:1.1rem;color:#06b6d4;font-weight:700;margin-top:0.2rem;">${teamMembers}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#14b8a6 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #14b8a633;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Direct Business</div>
              <div style="font-size:1.1rem;color:#14b8a6;font-weight:700;margin-top:0.2rem;">$${directBusiness}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#2dd4bf 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #2dd4bf33;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">Team Business</div>
              <div style="font-size:1.1rem;color:#2dd4bf;font-weight:700;margin-top:0.2rem;">$${teamBusiness}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#0ea5e9 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #0ea5e933;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">F-Leg Business</div>
              <div style="font-size:1.1rem;color:#0ea5e9;font-weight:700;margin-top:0.2rem;">$${fLegBusiness}</div>
            </div>
            <div style="background:linear-gradient(135deg,#0a192f 60%,#0284c7 100%);border-radius:1rem;padding:1rem 1.2rem;box-shadow:0 4px 24px #0284c733;display:flex;flex-direction:column;align-items:flex-start;">
              <div style="font-size:0.82rem;color:#bae6fd;letter-spacing:1px;font-weight:600;">O-Leg Business</div>
              <div style="font-size:1.1rem;color:#0284c7;font-weight:700;margin-top:0.2rem;">$${oLegBusiness}</div>
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
