import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/api/api";
import SendToAdminForm from "@/components/SendToAdminForm";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApplicationInfo {
  application_to_admin_id: number;
  application_id: number;
  application_status: string;
  additional_phone: string | null;
  full_name: string;
  phone: string;
  user_text: string;
  admin_text: string;
  creat_at: string;
  text: string;
  admin_deadline_time: string;
  sent_time: string;
  organization_id: number;
  organization_name: string;
  quarter_id: number;
  quarter_name: string;
  citizen_file: string | null;
  admin_extra_file: string | null;
  admin_photos: string[];
  inn: string;
  personal_buzines_name: string;
}

export default function OrganInfarmation() {
  const { t } = useTranslation();
  const { id } = useParams();
  const app_id = Number(id);
  const [data, setData] = useState<ApplicationInfo | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!app_id) return;
    axiosInstance
      .get(`/organ/app_send_admin`, { params: { app_id } })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data[0]);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          console.error("Xato:", err);
        }
      });
  }, [app_id]);

  const fetchApplicationDetails = async () => {
    if (!app_id) return;
    try {
      const res = await axiosInstance.get(`/organ/app_send_admin`, {
        params: { app_id },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data[0]);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Sessiya tugadi. Qayta tizimga kiring.");
        navigate("/login");
      } else {
        console.error("Xato:", err);
      }
    }
  };
  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 dark:text-blue-400">
        {t("loading")}
      </div>
    );

  const daysSince = Math.floor(
    (Date.now() - new Date(data.creat_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-8 bg-gray-50 dark:bg-[#101922] min-h-screen transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
          {t("applicationDetails")}
        </h1>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2 bg-white dark:bg-[#1a2533] text-gray-700 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-[#1e2a38] flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={18} /> {t("backToList")}
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white dark:bg-[#1a2533] rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 dark:border-gray-700">
              {t("applicationInformation")}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("fullName")}:
                </span>{" "}
                {data.full_name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("phone")}:
                </span>{" "}
                {data.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("inn")}:
                </span>{" "}
                {data.inn}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("personal_buzines_name")}:
                </span>{" "}
                {data.personal_buzines_name}
              </p>
              {data.additional_phone && (
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {t("additionalPhone")}:
                  </span>{" "}
                  {data.additional_phone}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("organization")}:
                </span>{" "}
                {data.organization_name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("quarter")}:
                </span>{" "}
                {data.quarter_name} (ID: {data.quarter_id})
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("status")}:
                </span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    data.application_status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {t(data.application_status)}{" "}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("createdAt")}:
                </span>{" "}
                {new Date(data.creat_at).toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("sentTime")}:
                </span>{" "}
                {new Date(data.sent_time).toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("adminDeadline")}:
                </span>{" "}
                {new Date(data.admin_deadline_time).toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("daysSince")}:
                </span>{" "}
                {daysSince} {t("days")}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a2533] rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100 dark:border-gray-700">
            <Accordion type="single" collapsible defaultValue="text">
              <AccordionItem value="text">
                <AccordionTrigger className="font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300">
                  {t("userApplicationText")}
                </AccordionTrigger>
                <AccordionContent
                  className="
          text-gray-600 dark:text-gray-300 text-sm leading-relaxed 
          break-words whitespace-pre-wrap 
          max-h-[300px] overflow-y-auto 
          p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50
        "
                >
                  {data.user_text || t("noApplicationText")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="admin">
                <AccordionTrigger className="font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300">
                  {t("adminResponseText")}
                </AccordionTrigger>
                <AccordionContent
                  className="
          text-gray-600 dark:text-gray-300 text-sm leading-relaxed 
          break-words whitespace-pre-wrap 
          max-h-[300px] overflow-y-auto 
          p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50
        "
                >
                  {data.admin_text || t("noAdminResponse")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2533] rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
            {t("communicationWithAdmin")}
          </h2>
          <div className="space-y-4 p-2 mb-3">
            <div className="flex flex-col items-start">
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-xl shadow-sm break-words w-full sm:w-auto max-w-full md:max-w-[80%] overflow-wrap-anywhere">
                {data.admin_text || t("noMessages")}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("admin")} (
                {new Date(data.admin_deadline_time).toLocaleDateString()})
              </span>
            </div>
            {/* <div className="flex flex-col items-end">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 p-3 rounded-xl shadow-sm break-words w-full sm:w-auto max-w-full md:max-w-[90%] overflow-wrap-anywhere">
                {data.user_text || "—"}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("you")} ({new Date(data.creat_at).toLocaleDateString()})
              </span>
            </div> */}
          </div>
          {![
            "completed",
            "not_completed",
            "admin_approval",
            "expired_closed",
            "accepted",
          ].includes(data.application_status) && (
            <SendToAdminForm
              application={data}
              onSendSuccess={fetchApplicationDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
}
