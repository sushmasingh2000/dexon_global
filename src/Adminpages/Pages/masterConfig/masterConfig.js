import { useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiConnectorGetAdmin, apiConnectorPostAdmin } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";

const CONFIG_FIELDS = [
  { id: 2, label: "Auto Payout", type: "toggle", hasComment: true, commentLabel: "Message to users" },
  { id: 3, label: "Topup", type: "toggle", hasComment: false },
  { id: 4, label: "Payout", type: "toggle", hasComment: true, commentLabel: "Service message" },
  { id: 5, label: "Minimum Pay-In ($)", type: "number", hasComment: false },
  { id: 6, label: "Fund Wallet Charges (%)", type: "percent", hasComment: true, commentLabel: "e.g. 0.05 = 5%" },
  { id: 7, label: "Earning Wallet Charges (%)", type: "percent", hasComment: true, commentLabel: "e.g. 0.05 = 5%" },
  { id: 8, label: "Capital Wallet Charges (%)", type: "percent", hasComment: true, commentLabel: "e.g. 0.05 = 5%" },
];

const MasterConfig = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery(
    ["master_config"],
    () => apiConnectorGetAdmin(endpoint?.get_master_config),
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const rows = data?.data?.result || [];
  const [cards, setCards] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rows.length > 0) {
      const initial = {};
      rows.forEach((r) => {
        const v = r.m00_value ?? "";
        const s = Number(r.m00_status) === 1;
        const c = r.m00_comment ?? "";
        initial[r.m00_id] = {
          value: v, status: s, comment: c,
          savedValue: v, savedStatus: s, savedComment: c,
        };
      });
      setCards(initial);
    }
  }, [data]);

  const update = (id, key, val) =>
    setCards((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));

  const isDirty = (id) => {
    const c = cards[id];
    if (!c) return false;
    return (
      String(c.value) !== String(c.savedValue) ||
      c.status !== c.savedStatus ||
      c.comment !== c.savedComment
    );
  };

  const handleSave = async (id) => {
    const c = cards[id];
    setSaving(true);
    try {
      const res = await apiConnectorPostAdmin(endpoint?.update_master_config, {
        id,
        value: c.value,
        status: c.status ? 1 : 0,
        comment: c.comment,
      });
      if (res?.data?.success) {
        toast.success("Config updated successfully");
        await queryClient.refetchQueries(["master_config"]);
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving config");
    }
    setSaving(false);
  };

  const showPageLoader = isLoading || saving || isFetching;
  const ready = !isLoading && Object.keys(cards).length > 0;

  return (
    <div
      className="p-4 min-h-screen"
      style={{ background: "linear-gradient(135deg, #060d1a 0%, #080f1e 50%, #060a14 100%)" }}
    >
      {showPageLoader && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(6,13,26,0.85)", backdropFilter: "blur(4px)" }}
        >
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400/40 border-r-cyan-400/40"
              style={{ animation: "spin 2s linear infinite" }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400"
              style={{ animation: "spin 0.7s linear infinite" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60" />
            </div>
          </div>
          <p className="text-cyan-400 text-sm tracking-widest uppercase animate-pulse">
            {saving ? "Saving changes..." : "Loading config..."}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 tracking-wide">
            Master Configuration
          </h2>
        </div>
        <div className="ml-4 h-px bg-gradient-to-r from-cyan-400/40 to-transparent" />
        <p className="ml-4 mt-1 text-gray-500 text-xs">
          Manage system-wide settings. Changes take effect immediately.
        </p>
      </div>

      {!ready ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CONFIG_FIELDS.map((field) => {
            const c = cards[field.id];
            const dirty = isDirty(field.id);
            if (!c) return null;

            return (
              <div key={field.id}
                className="relative rounded-xl border border-cyan-400/20 overflow-hidden p-5"
                style={{ background: "linear-gradient(135deg, rgba(6,13,26,0.95) 0%, rgba(8,15,30,0.95) 100%)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400/60 via-sky-400/40 to-transparent" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/10 rounded-tr-xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-cyan-300 text-sm font-bold uppercase tracking-wider">{field.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${c.status
                        ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30"
                        : "bg-red-400/10 text-red-400 border-red-400/30"
                      }`}>
                      {c.status ? "● Active" : "● Inactive"}
                    </span>
                    {dirty && (
                      <span className="text-amber-400 text-xs font-medium animate-pulse">● Unsaved</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider w-20">Status</span>
                    <button
                      onClick={() => update(field.id, "status", !c.status)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${c.status ? "border-cyan-400/50 bg-cyan-400/20" : "border-red-400/30 bg-red-400/10"
                        }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${c.status ? "left-6 bg-cyan-400 shadow-lg shadow-cyan-400/40" : "left-0.5 bg-red-400"
                        }`} />
                    </button>
                    <span className={`text-xs font-semibold ${c.status ? "text-cyan-400" : "text-red-400"}`}>
                      {c.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {(field.type === "number" || field.type === "percent") && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs uppercase tracking-wider w-20">Value</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step={field.type === "percent" ? "0.01" : "1"}
                          value={c.value}
                          onChange={(e) => update(field.id, "value", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-cyan-400/20 text-cyan-100 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ background: "rgba(6,13,26,0.8)" }}
                        />
                        {field.type === "percent" && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 text-xs">× 100%</span>
                        )}
                      </div>
                    </div>
                  )}
                  {field.hasComment && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 text-xs uppercase tracking-wider w-20 pt-2">
                        {field.commentLabel || "Comment"}
                      </span>
                      <textarea
                        rows={2}
                        value={c.comment}
                        onChange={(e) => update(field.id, "comment", e.target.value)}
                        placeholder="Optional message..."
                        className="flex-1 px-3 py-2 rounded-lg border border-cyan-400/20 text-cyan-100 text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none placeholder:text-gray-600"
                        style={{ background: "rgba(6,13,26,0.8)" }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSave(field.id)}
                  disabled={!dirty || saving}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 border relative overflow-hidden group ${dirty
                      ? "border-cyan-400/30 text-white hover:scale-[1.01] cursor-pointer"
                      : "border-gray-700/40 text-gray-600 cursor-not-allowed"
                    }`}
                  style={dirty ? { background: "rgba(34,211,238,0.12)" } : { background: "rgba(34,211,238,0.03)" }}
                >
                  {dirty && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-lg pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </div>
                  )}
                  <span className="relative z-10">
                    {dirty ? "Save Changes" : "No Changes"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MasterConfig;