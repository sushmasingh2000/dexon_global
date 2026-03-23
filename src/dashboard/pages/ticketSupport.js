import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { formatedDate, swalAlert } from "../../utils/utilityFun";
import { Visibility, AddCircleOutline } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const StatusBadge = ({ status }) => {
  const isPending = Number(status) === 0;
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isPending
          ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
          : "bg-green-500/15 text-green-400 border border-green-500/30"
      }`}
    >
      {isPending ? "Pending" : "Replied"}
    </span>
  );
};

// ── Shared modal shell ────────────────────────────────────────────────────────
const ModalShell = ({ onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="w-full max-w-md bg-gradient-to-br from-[#0a1219] via-[#0d1519] to-[#0f1b21] border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-400/20 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-l-2xl pointer-events-none" />
      {children}
    </div>
  </div>
);

const ModalDivider = () => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const UserTickets = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  // Raise ticket modal
  const [raiseModal, setRaiseModal]     = useState(false);
  const [raiseLoading, setRaiseLoading] = useState(false);
  const [message, setMessage]           = useState("");

  // View ticket modal
  const [viewModal, setViewModal]     = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const initialValues = { count: 10, start_date: "", end_date: "" };
  const fk = useFormik({ initialValues, enableReinitialize: true });

  // ── Fetch user's own tickets ──────────────────────────────────────────────
  const { data, isLoading } = useQuery(
    ["get_user_tickets", fk.values.start_date, fk.values.end_date, fk.values.count, page],
    () =>
      apiConnectorPost(endpoint?.get_user_message, {
        start_date: fk.values.start_date,
        end_date:   fk.values.end_date,
        page,
        count: fk.values.count,
        order: "DESC",
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching tickets:", err),
    }
  );

  const allData = data?.data?.result || [];

  // ── Raise ticket ──────────────────────────────────────────────────────────
  function openRaise()  { setMessage(""); setRaiseModal(true); }
  function closeRaise() { setRaiseModal(false); setMessage(""); }

  async function handleRaise() {
    if (!message.trim()) {
      toast.error("Please describe your issue before submitting.");
      return;
    }
    setRaiseLoading(true);
    try {
      // POST endpoint.user_message → { message }
      const res = await apiConnectorPost(endpoint?.user_message, {
        message: message.trim(),
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Ticket raised successfully!");
        client.invalidateQueries(["get_user_tickets"]);
        closeRaise();
      } else {
        toast.error(res?.data?.message || "Failed to raise ticket.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
    }
    setRaiseLoading(false);
  }

  // ── View ticket ───────────────────────────────────────────────────────────
  function openView(row)  { setSelectedRow(row); setViewModal(true); }
  function closeView()    { setViewModal(false); setSelectedRow(null); }

  // ── Table ─────────────────────────────────────────────────────────────────
  const tablehead = [
    <span>#</span>,
    <span>Ticket ID</span>,
    <span>Message</span>,
    <span>Status</span>,
    <span>Raised On</span>,
    <span>Reply Date</span>,
    <span>Action</span>,
  ];

  const tablerow = allData?.data?.map((row, idx) => [
    <span className="text-gray-400 text-sm">{(page - 1) * fk.values.count + idx + 1}</span>,

    <span className="text-cyan-300 font-mono text-sm">#{row?.tr54_id}</span>,

    <span className="text-gray-300 text-sm max-w-[220px] truncate block" title={row?.tr54_user_msg}>
      {row?.tr54_user_msg || "—"}
    </span>,

    <StatusBadge status={row?.tr54_status} />,

    <span className="text-gray-400 text-sm">{formatedDate(moment, row?.tr54_msg_date)}</span>,

    <span className="text-gray-400 text-sm">
      {row?.tr54_reply_date ? formatedDate(moment, row?.tr54_reply_date) : "—"}
    </span>,

    <button
      title="View Details"
      onClick={() => openView(row)}
      className="p-1 rounded-lg hover:bg-cyan-400/10 transition-colors"
    >
      <Visibility sx={{ color: "#749df5", fontSize: 20 }} />
    </button>,
  ]);

  const { data: profile, isLoading: profileLoading } = useQuery(
      ["get_profile"],
      () => apiConnectorGet(endpoint?.profile_api),
      {
        refetchOnMount: true,      
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      }
    );
    const user_profile = profile?.data?.result?.[0] || {};

  const navigate = useNavigate();
    if (user_profile.lgn_update_prof === "Deactive") {
      swalAlert(
        Swal,
        "Warning",
        "Please update all required fields in your profile to withdraw funds",
        () => navigate("/Profile")
      );
    }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-2">

      {/* Header row with date filters + Raise Ticket button */}
      <div className="flex flex-wrap items-end gap-3 mb-4">

        {/* Date filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">From Date</label>
            <input
              type="date"
              value={fk.values.start_date}
              onChange={(e) => { fk.setFieldValue("start_date", e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">To Date</label>
            <input
              type="date"
              value={fk.values.end_date}
              onChange={(e) => { fk.setFieldValue("end_date", e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          {(fk.values.start_date || fk.values.end_date) && (
            <button
              onClick={() => { fk.setFieldValue("start_date", ""); fk.setFieldValue("end_date", ""); setPage(1); }}
              className="self-end px-4 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:border-gray-400 hover:text-white transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Raise Ticket CTA */}
        <button
          onClick={openRaise}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/20"
        >
          <AddCircleOutline fontSize="small" />
          Raise Ticket
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg py-3 text-white bg-black border border-gray-700 shadow-md shadow-white/20">
        <CustomTable tablehead={tablehead} tablerow={tablerow} isLoading={isLoading} />
        <CustomToPagination
          page={page}
          setPage={setPage}
          data={allData}
          count={fk.values.count}
          onCountChange={(value) => { fk.setFieldValue("count", value); setPage(1); }}
        />
      </div>

      {/* ── Raise Ticket Modal ── */}
      {raiseModal && (
        <ModalShell onClose={closeRaise}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-cyan-400 font-bold text-lg">Raise a Ticket</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Describe your issue and our team will get back to you.
              </p>
            </div>
            <button
              onClick={closeRaise}
              className="text-gray-400 hover:text-white text-xl font-bold leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <ModalDivider />

          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Your Message <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your issue in detail..."
              className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-500"
            />
            <p className="text-gray-500 text-xs mt-1 text-right">{message.length} chars</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeRaise}
              className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleRaise}
              disabled={raiseLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {raiseLoading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── View Ticket Modal ── */}
      {viewModal && selectedRow && (
        <ModalShell onClose={closeView}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-cyan-400 font-bold text-lg">Ticket Details</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                <span className="text-cyan-300 font-mono font-semibold">#{selectedRow?.tr54_id}</span>
                &nbsp;·&nbsp;<StatusBadge status={selectedRow?.tr54_status} />
              </p>
            </div>
            <button
              onClick={closeView}
              className="text-gray-400 hover:text-white text-xl font-bold leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <ModalDivider />

          <div className="space-y-4 text-sm">
            {/* Raised on */}
            <div className="flex gap-3">
              <span className="text-gray-400 w-28 shrink-0">Raised On</span>
              <span className="text-cyan-100 font-medium">
                {formatedDate(moment, selectedRow?.tr54_msg_date)}
              </span>
            </div>

            {/* User message */}
            <div>
              <p className="text-gray-400 mb-1.5">Your Message</p>
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-gray-200 text-sm leading-relaxed max-h-44 overflow-y-auto">
                {selectedRow?.tr54_user_msg || "No message."}
              </div>
            </div>

            {/* Admin reply */}
            {Number(selectedRow?.tr54_status) === 1 ? (
              <div>
                <p className="text-gray-400 mb-1.5">
                  Admin Reply
                  <span className="text-gray-500 text-xs ml-2">
                    · {formatedDate(moment, selectedRow?.tr54_reply_date)}
                  </span>
                </p>
                <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-3 text-cyan-100 text-sm leading-relaxed">
                  {selectedRow?.tr54_reply}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-4 py-3">
                <span className="text-yellow-400 text-lg">⏳</span>
                <p className="text-yellow-300 text-sm">
                  Your ticket is under review. We'll reply soon.
                </p>
              </div>
            )}
          </div>

          <ModalDivider />

          <button
            onClick={closeView}
            className="w-full py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all duration-200"
          >
            Close
          </button>
        </ModalShell>
      )}
    </div>
  );
};

export default UserTickets;