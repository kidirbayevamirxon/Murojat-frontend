import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { axiosInstance } from "@/api/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Applications() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<StatusKey>("pending");
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const STATUS_DISPLAY_MAP = {
    explained: t("explained"),
    not_completed: t("notCompleted"),
    pending: t("pending"),
    sent_to_organ: t("sentToOrgan"),
    completed: t("completed"),
    review: t("review"),
    accepted: t("accepted"),
    admin_approval: t("adminApproval"),
    returned_to_organ: t("returnedToOrgan"),
    expired_closed: t("expiredClosed"),
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
    "explained",
    "completed",
    "not_completed",
    "sent_to_organ",
    "review",
    "accepted",
    "admin_approval",
    "returned_to_organ",
    "expired_closed",
  ];
  const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
  }
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
            STATUS_DISPLAY_MAP[item.status as StatusKey] || t("notCompleted"),
          date: new Date(item.created_at).toLocaleDateString(),
        })
      );

      setApplications(transformedApps);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error(t("sessionExpired"));
        navigate("/login");
      } else {
        setError(t("failed"));
      }
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
      className="
      p-6 min-h-screen transition-colors 
      bg-white text-gray-900 
      dark:bg-[#101922] dark:text-[#E4E9F2]
    "
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("applications")}</h1>
          <p className="text-gray-400 text-sm">{t("manageTrack")}</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full rounded-xl border 
            border-gray-300 dark:border-[#2B3648] 
            pl-10 pr-4 py-2.5 text-sm 
            text-gray-900 dark:text-[#E4E9F2]
            bg-white dark:bg-[#1A2433]
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-all duration-200 hover:border-blue-400
          "
          />
        </div>
      </div>
      <div className="lg:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as StatusKey)}
          className="
      w-full p-3 rounded-lg border
      border-gray-300 dark:border-[#2B3648]
      bg-white dark:bg-[#1A2433]
      text-gray-900 dark:text-[#E4E9F2]
      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
    "
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {STATUS_DISPLAY_MAP[tab]}
            </option>
          ))}
        </select>
      </div>
      <div className="relative border-none pb-2 mb-4 overflow-x-auto hidden lg:block">
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
        <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-[#F3F4F6] z-0" />
      </div>

      <div
        className="overflow-x-auto border rounded-lg"
        style={{ borderColor: "#DEDEDF" }}
      >
        <table className="min-w-full text-left text-sm border-separate border-spacing-y-2">
          <thead className="bg-gray-100 text-gray-900 dark:bg-[#1A2433] dark:text-[#E4E9F2]">
            <tr>
              <th className="px-4 py-3 font-semibold">{t("applicationId")}</th>
              <th className="px-4 py-3 font-semibold">{t("applicantName")}</th>
              <th className="px-4 py-3 font-semibold">{t("phone")}</th>
              <th className="px-4 py-3 font-semibold">{t("status")}</th>
              <th className="px-4 py-3 font-semibold">{t("submittedDate")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  {t("loading")}
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
                  className="
              cursor-pointer transition-colors duration-200 
              bg-white hover:bg-gray-100 
              dark:bg-[#1A2433] dark:hover:bg-[#1F2A3A]
              rounded-lg
            "
                >
                  <td className="px-4 py-3 font-medium text-blue-500 rounded-l-lg">
                    APP-{app.id}
                  </td>
                  <td className="px-4 py-3">{app.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {app.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full`}
                      style={{
                        backgroundColor:
                          app.status === t("completed")
                            ? "#0F5132"
                            : app.status === t("pending")
                            ? "#1E3A8A"
                            : app.status === t("returnedToOrgan")
                            ? "#58151C"
                            : "#2B3648",
                        color: "#E4E9F2",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 rounded-r-lg">
                    {app.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  {t("noApps")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
