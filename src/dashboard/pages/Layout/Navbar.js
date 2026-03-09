import { FaUserCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";

const Navbar = () => {
  const { data: profile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const user_profile = profile?.data?.result?.[0] || {};

  return (
    <nav
      className="
        sticky top-0 z-50 
        bg-[#0d1519] 
        backdrop-blur-md
        border-b border-cyan-400/40
        shadow-[0_4px_20px_rgba(0,255,255,0.15)]
      "
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left (Menu / Logo space) */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-cyan-400 text-2xl focus:outline-none">
            ☰
          </button>
        </div>

        {/* Right (User) */}
        <div className="flex items-center gap-3">
          <div
            className="
              w-9 h-9 rounded-full 
              border border-cyan-400 
              flex items-center justify-center
              shadow-[0_0_10px_rgba(0,255,255,0.6)]
            "
          >
            {user_profile?.rew_serial ? (
              <span className="text-cyan-400 font-semibold text-sm">
                {user_profile.rew_serial}
              </span>
            ) : (
              <FaUserCircle className="text-cyan-400 text-xl" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
