import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import CustomTable from "../../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { formatedDate } from "../../../utils/utilityFun";
import CustomTableSearch from "../../Shared/CustomTableSearch";
import { ReplyAll, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";

// ── Status badge ──────────────────────────────────────────────────────────────
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
const TicketAndSupport = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  // modals
  const [viewModal, setViewModal]       = useState(false);
  const [replyModal, setReplyModal]     = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [selectedRow, setSelectedRow]   = useState(null);
  const [replyText, setReplyText]       = useState("");

  const initialValues = {
    search: "",
    count: 10,
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({ initialValues, enableReinitialize: true });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery(
    [
      "get_all_tickets_admin",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      fk.values.count,
      page,
    ],
    () =>
      apiConnectorPostAdmin(endpoint?.get_user_message, {
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

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openView(row)  { setSelectedRow(row); setViewModal(true); }
  function closeView()    { setViewModal(false); setSelectedRow(null); }

  function openReply(row) { setSelectedRow(row); setReplyText(""); setReplyModal(true); }
  function closeReply()   { setReplyModal(false); setSelectedRow(null); setReplyText(""); }

  // ── Send reply ────────────────────────────────────────────────────────────
  async function handleReply() {
    if (!replyText.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    setReplyLoading(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.admin_reply, {
        msg_id:  selectedRow?.tr54_id,
        message: replyText.trim(),
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Reply sent successfully!");
        client.invalidateQueries(["get_all_tickets_admin"]);
        closeReply();
      } else {
        toast.error(res?.data?.message || "Failed to send reply.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
    }
    setReplyLoading(false);
  }

  // ── Table ─────────────────────────────────────────────────────────────────
  const tablehead = [
    <span>S.No.</span>,
    <span>Customer ID</span>,
    <span>Name</span>,
    <span>Email</span>,
    <span>Message</span>,
    <span>Status</span>,
    <span>Msg Date</span>,
    <span>Action</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => {
    const isPending = Number(row?.tr54_status) === 0;
    return [
      // S.No.
      <span className="text-gray-400 text-sm">
        {(page - 1) * (fk.values.count || 10) + index + 1}
      </span>,

      // Customer ID
      <span className="text-cyan-300 font-mono text-sm">
        {row?.tr03_cust_id || "—"}
      </span>,

      // Name
      <div>
        <p className="text-white text-sm font-medium">{row?.lgn_name || "—"}</p>
        {row?.spon_name && (
          <p className="text-gray-500 text-xs">Spon: {row.spon_name}</p>
        )}
      </div>,

      // Email
      <span className="text-gray-300 text-sm">{row?.lgn_email || "—"}</span>,

      // Message preview
      <span
        className="text-gray-300 text-sm max-w-[180px] truncate block"
        title={row?.tr54_user_msg}
      >
        {row?.tr54_user_msg || "—"}
      </span>,

      // Status
      <StatusBadge status={row?.tr54_status} />,

      // Date
      <span className="text-gray-400 text-sm">
        {formatedDate(moment, row?.tr54_msg_date)}
      </span>,

      // Actions
      <div className="flex items-center gap-2">
        {/* View */}
        <button
          title="View Ticket"
          onClick={() => openView(row)}
          className="p-1 rounded-lg hover:bg-cyan-400/10 transition-colors"
        >
          <Visibility sx={{ color: "#749df5", fontSize: 20 }} />
        </button>
        {/* Reply */}
        <button
          title={isPending ? "Send Reply" : "Already Replied"}
          onClick={() => isPending && openReply(row)}
          disabled={!isPending}
          className={`p-1 rounded-lg transition-colors ${
            isPending
              ? "hover:bg-green-400/10 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
        >
          <ReplyAll sx={{ color: "#4ade80", fontSize: 20 }} />
        </button>
      </div>,
    ];
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-2">
      <CustomTableSearch
        fk={fk}
        onClearFn={() => setPage(1)}
        onSubmitFn={() => {
          setPage(1);
          client.invalidateQueries(["get_all_tickets_admin"]);
        }}
      />

      {/* Table */}
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

      {/* ── View Modal ── */}
      {viewModal && selectedRow && (
        <ModalShell onClose={closeView}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-cyan-400 font-bold text-lg">Ticket Details</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                ID{" "}
                <span className="text-cyan-300 font-semibold font-mono">
                  #{selectedRow?.tr54_id}
                </span>
                &nbsp;·&nbsp;
                <StatusBadge status={selectedRow?.tr54_status} />
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

          <div className="space-y-3 text-sm">
            {[
              { label: "Customer ID", value: selectedRow?.tr03_cust_id },
              { label: "Name",        value: selectedRow?.lgn_name },
              { label: "Email",       value: selectedRow?.lgn_email },
              { label: "Sponsor",     value: selectedRow?.spon_name },
              { label: "Raised On",   value: formatedDate(moment, selectedRow?.tr54_msg_date) },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="text-gray-400 w-28 shrink-0">{label}</span>
                <span className="text-cyan-100 font-medium break-all">{value || "—"}</span>
              </div>
            ))}

            {/* User message */}
            <div>
              <p className="text-gray-400 mb-1.5">User Message</p>
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-gray-200 text-sm leading-relaxed max-h-40 overflow-y-auto">
                {selectedRow?.tr54_user_msg || "No message."}
              </div>
            </div>

            {/* Admin reply — show if already replied */}
            {selectedRow?.tr54_reply && (
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
            )}
          </div>

          <ModalDivider />

          <div className="flex gap-3 mt-1">
            {Number(selectedRow?.tr54_status) === 0 && (
              <button
                onClick={() => { closeView(); openReply(selectedRow); }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200"
              >
                Reply
              </button>
            )}
            <button
              onClick={closeView}
              className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all duration-200"
            >
              Close
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── Reply Modal ── */}
      {replyModal && selectedRow && (
        <ModalShell onClose={closeReply}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-cyan-400 font-bold text-lg">Reply to Ticket</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                <span className="text-cyan-300 font-semibold">{selectedRow?.lgn_name}</span>
                &nbsp;·&nbsp;
                <span className="text-cyan-300 font-mono">#{selectedRow?.tr54_id}</span>
              </p>
            </div>
            <button
              onClick={closeReply}
              className="text-gray-400 hover:text-white text-xl font-bold leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <ModalDivider />

          {/* Original message preview */}
          <div className="mb-4 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">User's Message</p>
            <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
              {selectedRow?.tr54_user_msg}
            </p>
          </div>

          {/* Reply textarea */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Your Reply <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/90 text-cyan-100 text-sm border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-500"
            />
            <p className="text-gray-500 text-xs mt-1 text-right">
              {replyText.length} chars
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeReply}
              className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={replyLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replyLoading ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

export default TicketAndSupport;