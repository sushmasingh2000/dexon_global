import { useState } from "react";
import {
  FaCoins, FaFileInvoiceDollar, FaToggleOn, FaRobot, FaHeadset,
  FaChartLine, FaUniversity, FaCheck, FaSave, FaLock, FaUnlock,
  FaChevronDown, FaEdit, FaBan, FaCheckCircle, FaSearch, FaTimes,
  FaUserShield, FaKey, FaMobile, FaEnvelope, FaCalendarAlt,
  FaTrash, FaExchangeAlt, FaReply, FaUsers, FaUserEdit,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { apiConnectorGetAdmin, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";

// ─── Permission tree — granular write/action permissions ──────────────────────
const PERMISSION_TREE = [
  {
    key: "members", label: "Members", icon: <FaUsers />,
    children: [
      { key: "members.update_profile", label: "Update Member Profile", icon: <FaUserEdit /> },
    ],
  },
  {
    key: "fund", label: "Fund Management", icon: <FaUniversity />,
    children: [
      { key: "fund.topup",              label: "Member Topup",             icon: <FaCoins /> },
      { key: "fund.withdrawal_approve", label: "Approve Withdrawal",       icon: <FaFileInvoiceDollar /> },
      { key: "fund.withdrawal_toggle",  label: "Toggle Withdrawal Access", icon: <FaToggleOn /> },
    ],
  },
  {
    key: "trade", label: "Trade & Pairs", icon: <FaRobot />,
    children: [
      { key: "trade.create",            label: "Create Trade Pair",          icon: <FaExchangeAlt /> },
      { key: "trade.update_status",     label: "Update Trade Pair Status",   icon: <FaChartLine /> },
      { key: "trade.delete",            label: "Delete Trade Pair",          icon: <FaTrash /> },
      { key: "trade.toggle_permission", label: "Toggle Member Trade Access", icon: <FaToggleOn /> },
      { key: "trade.update_profit",     label: "Update Trade Profit",        icon: <FaChartLine /> },
    ],
  },
  {
    key: "tickets", label: "Ticket & Support", icon: <FaHeadset />,
    children: [
      { key: "tickets.reply", label: "Reply to Tickets", icon: <FaReply /> },
    ],
  },
];

const ALL_KEYS   = PERMISSION_TREE.flatMap((p) => p.children.length ? [p.key, ...p.children.map((c) => c.key)] : [p.key]);
const childrenOf = (k) => PERMISSION_TREE.find((p) => p.key === k)?.children.map((c) => c.key) ?? [];
const emptyPerms = ()  => Object.fromEntries(ALL_KEYS.map((k) => [k, false]));
const fullPerms  = ()  => Object.fromEntries(ALL_KEYS.map((k) => [k, true]));
const permsToArr = (o) => Object.entries(o).filter(([, v]) => v).map(([k]) => k);
const arrToPerms = (a) => Object.fromEntries(ALL_KEYS.map((k) => [k, a.includes(k)]));

const parentState = (k, perms) => {
  const kids = childrenOf(k);
  if (!kids.length) return perms[k] ? "full" : "none";
  const n = kids.filter((c) => perms[c]).length;
  return n === 0 ? "none" : n === kids.length ? "full" : "partial";
};

const avatarColor = (name = "") => {
  const colors = [
    "from-cyan-400 to-blue-500",    "from-purple-400 to-pink-500",
    "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500",
    "from-rose-400 to-red-500",     "from-violet-400 to-purple-500",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

// ─────────────────────────────────────────────────────────────────────────────
export default function SubAdminPermissions() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const [editSA,     setEditSA]     = useState(null);
  const [editPerms,  setEditPerms]  = useState(emptyPerms());
  const [editExpd,   setEditExpd]   = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const { data: subAdminData, isLoading } = useQuery(
    ["get_all_subadmins"],
    () => apiConnectorGetAdmin(endpoint?.get_subadmins),
    {
      keepPreviousData:     true,
      refetchOnMount:       true,
      refetchOnReconnect:   false,
      refetchOnWindowFocus: false,
      onError: () => toast.error("Failed to load sub-admins"),
    }
  );

  const subAdmins = subAdminData?.data?.result || [];
  const filtered  = subAdmins.filter((sa) =>
    sa.lgn_name?.toLowerCase().includes(search.toLowerCase())  ||
    sa.lgn_email?.toLowerCase().includes(search.toLowerCase()) ||
    sa.lgn_cust_id?.toLowerCase().includes(search.toLowerCase())
  );

  const applyToggle = (key) => {
    const isParent = PERMISSION_TREE.some((p) => p.key === key);
    if (isParent) {
      const kids = childrenOf(key);
      if (!kids.length) { setEditPerms((p) => ({ ...p, [key]: !p[key] })); return; }
      const nxt = parentState(key, editPerms) !== "full";
      setEditPerms((p) => { const u = { ...p, [key]: nxt }; kids.forEach((k) => (u[k] = nxt)); return u; });
    } else {
      setEditPerms((p) => ({ ...p, [key]: !p[key] }));
    }
  };

  const handleUpdate = async () => {
    setEditSaving(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.update_subadmin_permissions, {
        login_id:    editSA.login_id,
        permissions: permsToArr(editPerms),
      });
      if (String(res?.data?.success) === "true") {
        toast.success(res?.data?.message || "Permissions updated!");
        setEditSA(null);
        queryClient.invalidateQueries(["get_all_subadmins"]);
      } else {
        toast.error(res?.data?.message || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setEditSaving(false);
    }
  };

  const handleBlock = async (sa) => {
    const status = sa.lgn_is_blocked === "Yes" ? "No" : "Yes";
    try {
      const res = await apiConnectorPostAdmin(endpoint?.toggle_subadmin_status, {
        login_id: sa.login_id, status,
      });
      if (String(res?.data?.success) === "true") {
        toast.success(status === "Yes" ? "Sub-admin blocked" : "Sub-admin unblocked");
        queryClient.invalidateQueries(["get_all_subadmins"]);
      } else {
        toast.error(res?.data?.message || "Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen text-white px-4 py-6"
      style={{ background: "linear-gradient(135deg,#060d14 0%,#0a1219 50%,#0d1821 100%)" }}
    >
      {/* Header */}
      <div className="mb-6 relative">
        <div className="absolute -top-2 left-0 w-1 h-16 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
        <div className="pl-5 flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <MdAdminPanelSettings className="text-cyan-400 text-3xl" />
              <h1 className="text-2xl font-bold">
                Sub-Admin <span className="text-cyan-400">Permissions</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Sub-admins can <span className="text-cyan-400/70">read all data</span>. Permissions below control <span className="text-cyan-400/70">write actions</span> only.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/15"
              style={{ background: "rgba(34,211,238,0.05)" }}
            >
              <FaUserShield className="text-cyan-400 text-sm" />
              <span className="text-white font-bold text-sm">{subAdmins.length}</span>
              <span className="text-gray-500 text-xs">Total</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-400/15"
              style={{ background: "rgba(34,197,94,0.05)" }}
            >
              <FaCheck className="text-green-400 text-sm" />
              <span className="text-white font-bold text-sm">
                {subAdmins.filter((s) => s.lgn_is_blocked !== "Yes").length}
              </span>
              <span className="text-gray-500 text-xs">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or ID…" className="s-input pl-9"
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/5 p-5 animate-pulse"
              style={{ background: "linear-gradient(135deg,#080f18,#0a1520)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded" />
                <div className="h-2 bg-white/5 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <FaUserShield className="text-gray-700 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            {search ? "No sub-admins match your search." : "No sub-admins found. Promote a member from the Member List page."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((sa) => (
            <SACard key={sa.login_id} sa={sa}
              onEdit={() => { setEditSA(sa); setEditPerms(arrToPerms(sa.permissions || [])); setEditExpd({}); }}
              onBlock={() => handleBlock(sa)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editSA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditSA(null); }}
        >
          <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-cyan-400/25 overflow-hidden"
            style={{ background: "linear-gradient(135deg,#080f18,#0a1520)", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-cyan-400/10 flex-shrink-0"
              style={{ background: "linear-gradient(90deg,rgba(34,211,238,0.05),transparent)" }}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(editSA.lgn_name)} flex items-center justify-center font-bold text-black text-sm flex-shrink-0`}>
                {editSA.lgn_name?.[0]?.toUpperCase() || "S"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{editSA.lgn_name}</p>
                <p className="text-gray-500 text-xs truncate">
                  {editSA.lgn_email} · <span className="text-cyan-400/70 font-mono">{editSA.lgn_cust_id}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-400/20 flex-shrink-0"
                style={{ background: "rgba(34,211,238,0.06)" }}
              >
                <FaKey className="text-cyan-400 text-xs" />
                <span className="text-cyan-400 font-bold text-xs">{Object.values(editPerms).filter(Boolean).length}</span>
                <span className="text-gray-600 text-xs">/ {ALL_KEYS.length}</span>
              </div>
              <button onClick={() => setEditSA(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
              ><FaTimes size={12} /></button>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0">
              <span className="text-xs text-gray-500">Toggle write-action permissions below</span>
              <div className="flex gap-2">
                <SMiniBtn onClick={() => setEditPerms(fullPerms())}  color="green" icon={<FaUnlock />} label="Select All" />
                <SMiniBtn onClick={() => setEditPerms(emptyPerms())} color="red"   icon={<FaLock />}   label="Clear All" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scroll">
              <PermTree tree={PERMISSION_TREE} perms={editPerms} expd={editExpd} setExpd={setEditExpd} onToggle={applyToggle} />
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-400/10 flex-shrink-0"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <p className="text-xs text-gray-600 italic">Changes take effect on next sub-admin login.</p>
              <div className="flex gap-3">
                <button onClick={() => setEditSA(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
                >Cancel</button>
                <button onClick={handleUpdate} disabled={editSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all disabled:opacity-60"
                >
                  {editSaving
                    ? <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
                    : <><FaSave />Save Permissions</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .s-input{width:100%;background:#060d14;border:1px solid rgba(34,211,238,0.15);border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.875rem;color:white;outline:none;transition:border-color .2s,box-shadow .2s;}
        .s-input::placeholder{color:#4b5563;}
        .s-input:focus{border-color:rgba(34,211,238,0.45);box-shadow:0 0 0 3px rgba(34,211,238,0.08);}
        .custom-scroll::-webkit-scrollbar{width:4px;}
        .custom-scroll::-webkit-scrollbar-track{background:transparent;}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(34,211,238,0.2);border-radius:2px;}
        .custom-scroll::-webkit-scrollbar-thumb:hover{background:rgba(34,211,238,0.4);}
      `}</style>
    </div>
  );
}

// ─── SACard ───────────────────────────────────────────────────────────────────
const SACard = ({ sa, onEdit, onBlock }) => {
  const blocked    = sa.lgn_is_blocked === "Yes";
  const permsArr   = sa.permissions || [];
  const totalPerms = permsArr.length;
  const modules    = PERMISSION_TREE.filter((p) =>
    permsArr.includes(p.key) || p.children.some((c) => permsArr.includes(c.key))
  );

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background:  "linear-gradient(135deg,#080f18 0%,#0a1520 100%)",
        borderColor: blocked ? "rgba(239,68,68,0.15)" : "rgba(34,211,238,0.12)",
        boxShadow:   blocked ? "0 4px 24px rgba(239,68,68,0.06)" : "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className={`h-0.5 ${blocked ? "bg-gradient-to-r from-red-500/60 to-transparent" : "bg-gradient-to-r from-cyan-400/50 to-transparent"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor(sa.lgn_name)} flex items-center justify-center font-bold text-black text-lg flex-shrink-0 shadow-lg`}>
              {sa.lgn_name?.[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">{sa.lgn_name || "—"}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <FaEnvelope className="text-cyan-600" />{sa.lgn_email}
              </p>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border flex-shrink-0
            ${blocked ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}
          >{blocked ? "BLOCKED" : "ACTIVE"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <FaMobile className="text-cyan-600 flex-shrink-0" />
            <span className="truncate">{sa.lgn_mobile || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <FaUserShield className="text-cyan-600 flex-shrink-0" />
            <span className="font-mono text-cyan-400/70">{sa.lgn_cust_id}</span>
          </div>
          {sa.lgn_created_at && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 col-span-2">
              <FaCalendarAlt className="text-cyan-600 flex-shrink-0" />
              <span>Created {new Date(sa.lgn_created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
            </div>
          )}
        </div>

        {/* Write Permissions */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <FaKey className="text-cyan-600" /> Write Permissions
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
              ${totalPerms === 0
                ? "bg-gray-800 text-gray-600 border-gray-700"
                : totalPerms === ALL_KEYS.length
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-cyan-400/10 text-cyan-400 border-cyan-400/20"}`}
            >{totalPerms}/{ALL_KEYS.length} granted</span>
          </div>

          {totalPerms === 0 ? (
            <p className="text-[11px] text-gray-600 italic py-1">Read-only access. No write permissions.</p>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scroll pr-1">
              {modules.map((mod) => {
                const childGranted = mod.children.filter((c) => permsArr.includes(c.key));
                const modGranted   = permsArr.includes(mod.key);
                const allGranted   = modGranted && (mod.children.length === 0 || childGranted.length === mod.children.length);
                return (
                  <div key={mod.key} className="rounded-lg px-3 py-2 border"
                    style={{ background: "rgba(34,211,238,0.03)", borderColor: allGranted ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={allGranted ? "text-cyan-400" : "text-gray-500"}>{mod.icon}</span>
                        <span className={allGranted ? "text-white font-medium" : "text-gray-400"}>{mod.label}</span>
                      </div>
                      {mod.children.length > 0 && (
                        <span className="text-[9px] text-gray-600">{childGranted.length}/{mod.children.length}</span>
                      )}
                    </div>
                    {childGranted.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {childGranted.map((c) => (
                          <span key={c.key}
                            className="text-[9px] bg-cyan-400/8 border border-cyan-400/12 text-cyan-400/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                          >
                            <span className="text-[8px]">{c.icon}</span>{c.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-white/5">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            style={{ background:"linear-gradient(135deg,rgba(6,182,212,0.15),rgba(14,116,144,0.1))", border:"1px solid rgba(34,211,238,0.25)", color:"rgba(34,211,238,0.9)" }}
          ><FaEdit size={11} /> Edit Permissions</button>
          <button onClick={onBlock}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: blocked ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border:     blocked ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
              color:      blocked ? "#4ade80" : "#f87171",
            }}
          >
            {blocked ? <><FaCheckCircle size={11} /> Unblock</> : <><FaBan size={11} /> Block</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const SMiniBtn = ({ onClick, color, icon, label }) => (
  <button onClick={onClick}
    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
      ${color === "green"
        ? "border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20"
        : "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"}`}
  >{icon}{label}</button>
);

const PermTree = ({ tree, perms, expd, setExpd, onToggle }) => (
  <div className="space-y-2">
    {tree.map((parent) => {
      const hasK = parent.children.length > 0;
      const open = expd[parent.key];
      const s    = parentState(parent.key, perms);
      return (
        <div key={parent.key} className="rounded-xl border overflow-hidden"
          style={{
            background:  "linear-gradient(135deg,#080f18,#0a1520)",
            borderColor: s === "full" ? "rgba(34,211,238,0.3)" : s === "partial" ? "rgba(234,179,8,0.2)" : "rgba(34,211,238,0.08)",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer group select-none"
            onClick={() => hasK && setExpd((e) => ({ ...e, [parent.key]: !e[parent.key] }))}
          >
            <div onClick={(e) => { e.stopPropagation(); onToggle(parent.key); }}
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 cursor-pointer transition-all
                ${s === "full"    ? "bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                : s === "partial" ? "bg-yellow-400/20 border-yellow-400/60"
                :                   "bg-transparent border-gray-600 hover:border-cyan-400/50"}`}
            >
              {s === "full"    && <FaCheck size={9} className="text-black" />}
              {s === "partial" && <div className="w-2 h-0.5 bg-yellow-400 rounded-full" />}
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm transition-all
              ${s !== "none" ? "bg-cyan-400/15 text-cyan-400" : "bg-white/5 text-gray-500 group-hover:text-cyan-600"}`}
            >{parent.icon}</div>
            <div className="flex-1">
              <span className={`font-semibold text-sm ${s !== "none" ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                {parent.label}
              </span>
              {hasK && (
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {parent.children.filter((c) => perms[c.key]).length}/{parent.children.length} enabled
                </p>
              )}
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
              ${s === "full"    ? "bg-green-500/10 text-green-400 border-green-500/20"
              : s === "partial" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              :                   "bg-gray-800 text-gray-600 border-gray-700"}`}
            >{s === "full" ? "FULL" : s === "partial" ? "PARTIAL" : "NONE"}</span>
            {hasK && (
              <span className={`text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                <FaChevronDown size={10} />
              </span>
            )}
          </div>
          {hasK && open && (
            <div className="border-t border-white/5 px-4 py-2 space-y-1" style={{ background: "rgba(0,0,0,0.2)" }}>
              {parent.children.map((child) => {
                const on = perms[child.key];
                return (
                  <div key={child.key} onClick={() => onToggle(child.key)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all
                      ${on ? "bg-cyan-400/8 border border-cyan-400/15" : "hover:bg-white/3 border border-transparent"}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${on ? "bg-cyan-400 border-cyan-400" : "bg-transparent border-gray-700 group-hover:border-cyan-400/40"}`}
                    >{on && <FaCheck size={7} className="text-black" />}</div>
                    <span className={`text-sm ${on ? "text-cyan-400" : "text-gray-600 group-hover:text-cyan-600"}`}>{child.icon}</span>
                    <span className={`text-sm flex-1 ${on ? "text-white font-medium" : "text-gray-500 group-hover:text-gray-300"}`}>{child.label}</span>
                    <div className={`w-7 h-4 rounded-full relative flex-shrink-0 transition-all ${on ? "bg-cyan-400" : "bg-gray-700"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${on ? "left-[14px]" : "left-0.5"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
);