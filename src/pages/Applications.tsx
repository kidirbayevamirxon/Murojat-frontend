import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { axiosInstance } from "@/api/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const STATUS_DISPLAY_MAP = {
  not_completed: "Not Completed",
  pending: "Pending",
  sent_to_organ: "Sent to Organ",
  completed: "Completed",
  review: "Review",
  accepted: "Accepted",
  admin_approval: "Admin Approval",
  returned_to_organ: "Returned to Organ",
  expired_closed: "Expired / Closed",
} as const;

type StatusKey = keyof typeof STATUS_DISPLAY_MAP;
type StatusValue = (typeof STATUS_DISPLAY_MAP)[StatusKey];

type Application = {
  id: string;
  name: string;
  phone: string;
  organization: string;
  status: StatusValue;
  date: string;
};

const tabs: StatusKey[] = [
  "pending",
  "completed",
  "not_completed",
  "sent_to_organ",
  "review",
  "accepted",
  "admin_approval",
  "returned_to_organ",
  "expired_closed",
];

export default function Applications() {
  const [activeTab, setActiveTab] = useState<StatusKey>("pending");
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/get_send_apps", {
        params: { status: activeTab, page: 1 },
      });

      const transformedApps: Application[] = response.data.items.map(
        (item: any) => ({
          id: item.id,
          name: item.full_name,
          phone: item.phone || "N/A",
          organization: item.organization || "N/A",
          status:
            STATUS_DISPLAY_MAP[item.status as StatusKey] || "Not Completed",
          date: new Date(item.created_at).toLocaleDateString(),
        })
      );

      setApplications(transformedApps);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const filtered = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.organization.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toString().includes(search)
  );

  return (
    <div
      className="p-6 min-h-screen transition-colors"
      style={{ backgroundColor: "#101922", color: "#E4E9F2" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-gray-400 text-sm">
            Manage and track all applications.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full rounded-xl border border-[#2B3648] 
              pl-10 pr-4 py-2.5 text-sm text-[#E4E9F2]
              shadow-sm bg-[#1A2433] placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200 hover:border-blue-400
            "
          />
        </div>
      </div>
      <div className="relative border-none pb-2 mb-4 overflow-x-auto">
        <div className="flex gap-6 relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {STATUS_DISPLAY_MAP[tab]}
              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-500 rounded-full z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-[#2B3648] z-0" />
      </div>
      <div
        className="overflow-x-auto border rounded-lg"
        style={{ borderColor: "#2B3648" }}
      >
        <table className="min-w-full text-left text-sm border-separate border-spacing-y-2">
          <thead style={{ backgroundColor: "#1A2433", color: "#E4E9F2" }}>
            <tr>
              <th className="px-4 py-3 font-semibold">Application ID</th>
              <th className="px-4 py-3 font-semibold">Applicant Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  Loading applications...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-red-400">
                  {error}
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => navigate(`/applications/info/${app.id}`)}
                  className="cursor-pointer transition-colors duration-200 hover:bg-[#1F2A3A]"
                  style={{
                    backgroundColor: "#1A2433",
                    borderRadius: "10px",
                  }}
                >
                  <td className="px-4 py-3 font-medium text-blue-400 rounded-l-lg">
                    APP-{app.id}
                  </td>
                  <td className="px-4 py-3">{app.name}</td>
                  <td className="px-4 py-3 text-gray-300">{app.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full`}
                      style={{
                        backgroundColor:
                          app.status === "Completed"
                            ? "#0F5132"
                            : app.status === "Pending"
                            ? "#1E3A8A"
                            : app.status === "Returned to Organ"
                            ? "#58151C"
                            : "#2B3648",
                        color: "#E4E9F2",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 rounded-r-lg">
                    {app.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
