import { hasPermission } from "../../utils/permissions";

const PermissionGate = ({ require: key, children }) => {
  const keys = Array.isArray(key) ? key : [key];
  if (!key || keys.some(hasPermission)) return children;
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "60vh" }}
    >
      <div className="text-center px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-white text-sm font-semibold mb-1">Access Restricted</p>
        <p className="text-gray-500 text-xs">
          You don't have access to this section.
        </p>
      </div>
    </div>
  );
};

export default PermissionGate;
