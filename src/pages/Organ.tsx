import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import OrganWarningModal from "@/components/OrganWarningModal";

interface Application {
  id: number;
  full_name: string;
  phone: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending:
    "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  not_completed:
    "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700",
  sent_to_organ:
    "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700",
  completed:
    "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
  review:
    "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700",
  accepted:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
  admin_approval:
    "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
  expired_closed:
    "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-700",
  returned_to_organ:
    "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700",
};

const statuses = [
  "sent_to_organ",
  "not_completed",
  "completed",
  "review",
  "accepted",
  "admin_approval",
  "expired_closed",
  "returned_to_organ",
];

export default function Organ() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("sent_to_organ");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [warnings, setWarnings] = useState<any>({});
    const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
  }
  useEffect(() => {
    const getWarnings = async () => {
      try {
        const res = await axiosInstance.get("/organ/warning/apps");
        const d = res.data;
        const mapped = {
          accepted: d.accepted || 0,
          sentToOrgan: {
            today: d.sent_to_organ?.today || 0,
            tomorrow: d.sent_to_organ?.tomorrow || 0,
            within5Days: d.sent_to_organ?.within_5_days || 0,
            within15Days: d.sent_to_organ?.within_15_days || 0,
          },
          review: {
            today: d.review?.today || 0,
            tomorrow: d.review?.tomorrow || 0,
            within5Days: d.review?.within_5_days || 0,
            within15Days: d.review?.within_15_days || 0,
          },
        };
        setWarnings(mapped);
        setShowWarning(true);
      } catch (error) {
        toast.error(t("fetchError"));
      }
    };
    getWarnings();
  }, []);

  const getApplications = async () => {
    try {
      setLoading(true);
      const params: any = { page, status: statusFilter };
      const res = await axiosInstance.get("/organ/get_app_status", { params });
      const data = res.data;
      const apps = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : [];
      setApplications(apps);
      setTotalPages(data.pages || 1);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error(t("sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("fetchError"));
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, [statusFilter, page]);

  const filtered = applications.filter(
    (a) =>
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      String(a.id).includes(search)
  );

  return (
    <div
      className={`p-4 min-h-[85vh] transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#101922] text-gray-100"
          : "bg-gradient-to-b from-white to-blue-50 text-gray-900"
      }`}
    >
      <OrganWarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        data={warnings}
      />
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        {t("applications")}
      </h1>
      <div
        className={`rounded-2xl shadow-sm border p-5 mb-6 transition-colors ${
          theme === "dark"
            ? "bg-[#101922] border-gray-800"
            : "bg-white border-blue-100"
        }`}
      >
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full sm:w-72 ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-400 focus-visible:ring-blue-500"
                : "border-blue-200 focus-visible:ring-blue-500"
            }`}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className={`w-52 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-gray-200"
                  : "border-blue-200"
              }`}
            >
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table
            className={`min-w-full border-t text-sm ${
              theme === "dark" ? "border-gray-700" : ""
            }`}
          >
            <thead
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-blue-300"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              <tr className="text-left">
                <th className="py-3 px-4">{t("applicationId")}</th>
                <th className="py-3 px-4">{t("applicantName")}</th>
                <th className="py-3 px-4">{t("phoneNumber")}</th>
                <th className="py-3 px-4">{t("status")}</th>
                <th className="py-3 px-4">{t("dateSubmitted")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-blue-500 dark:text-blue-400"
                  >
                    {t("loading")}
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-t cursor-pointer transition-colors ${
                      theme === "dark"
                        ? "border-gray-800 hover:bg-gray-800/60"
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => navigate(`/organ/info/${a.id}`)}
                  >
                    <td className="py-3 px-4 font-medium">#{a.id}</td>
                    <td className="py-3 px-4">{a.full_name}</td>
                    <td className="py-3 px-4">{a.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[a.status] ||
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {t(a.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {a.created_at?.slice(0, 10) || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    {t("noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("showingResults", {
              filtered: filtered.length,
              total: applications.length,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`${
                theme === "dark"
                  ? "text-blue-400 border-gray-700 hover:bg-gray-800"
                  : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
            >
              &lt;
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
                className={`${
                  page === i + 1
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : theme === "dark"
                    ? "border-gray-700 text-blue-400 hover:bg-gray-800"
                    : "border-blue-300 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`${
                theme === "dark"
                  ? "text-blue-400 border-gray-700 hover:bg-gray-800"
                  : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
