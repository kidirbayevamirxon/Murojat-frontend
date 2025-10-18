import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
}

export default function OrganInfarmation() {
  const { t } = useTranslation();
  const { id } = useParams();
  const app_id = Number(id);
  const [data, setData] = useState<ApplicationInfo | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("not_completed");
  const [citizenFile, setCitizenFile] = useState<File | null>(null);
  const [adminExtraFile, setAdminExtraFile] = useState<File | null>(null);
  const [adminPhotos, setAdminPhotos] = useState<File[]>([]);
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    if (!app_id) return;
    axiosInstance
      .get(`/organ/app_send_admin`, { params: { app_id } })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [app_id]);

  const handleSend = async () => {
    if (!data) {
      toast.error(t("noDataLoaded"));
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("application_id", data.application_id.toString());
      formData.append("text", message);
      formData.append("status", status);
      formData.append("days", day?.toString() || "0");
      if (citizenFile) formData.append("citizen_file", citizenFile);
      if (adminExtraFile) formData.append("admin_extra_file", adminExtraFile);
      adminPhotos.forEach((photo) => formData.append("admin_photos", photo));
      await axiosInstance.post("/organ/send_to_admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("messageSentSuccess"));
      setMessage("");
      setCitizenFile(null);
      setAdminExtraFile(null);
      setAdminPhotos([]);
      const res = await axiosInstance.get(`/organ/app_send_admin`, {
        params: { app_id },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data[0]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || t("sendFailed"));
    } finally {
      setLoading(false);
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
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {data.user_text || t("noApplicationText")}{" "}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="admin">
                <AccordionTrigger className="font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300">
                  {t("adminResponseText")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {data.admin_text || t("noAdminResponse")}{" "}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2533] rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 border-b pb-2 dark:border-gray-700">
            {t("communicationWithAdmin")}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-3">
            <div className="flex flex-col items-start">
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-xl max-w-xs shadow-sm">
                {data.admin_text || t("noMessages")}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("admin")} (
                {new Date(data.admin_deadline_time).toLocaleDateString()})
              </span>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 p-3 rounded-xl max-w-xs shadow-sm">
                {data.user_text || "—"}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("you")} ({new Date(data.creat_at).toLocaleDateString()})
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t pt-3 dark:border-gray-700">
            <div className="flex gap-2 items-center">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("status")}:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
                >
                  <option value="not_completed">{t("not_completed")}</option>
                  <option value="pending">{t("pending")}</option>
                  <option value="sent_to_organ">{t("sent_to_organ")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="review">{t("review")}</option>
                  <option value="accepted">{t("accepted")}</option>
                  <option value="admin_approval">{t("admin_approval")}</option>
                  <option value="expired_closed">{t("expired_closed")}</option>
                  <option value="returned_to_organ">
                    {t("returned_to_organ")}
                  </option>
                </select>
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("days")}:
                </label>
                <Input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  inputMode="numeric"
                />
              </div>
            </div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("citizenFile")}:
            </label>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setCitizenFile(e.target.files?.[0] || null)}
              className="bg-white dark:bg-[#1a2533] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("adminExtraFile")}:
            </label>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setAdminExtraFile(e.target.files?.[0] || null)}
              className="bg-white dark:bg-[#1a2533] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("adminPhotos")}:
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setAdminPhotos(Array.from(e.target.files || []))}
              className="bg-white dark:bg-[#1a2533] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <Input
              placeholder={t("typeYourMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 bg-white dark:bg-[#1a2533] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white w-full rounded-lg"
            >
              {loading ? t("sending") : t("sendMessage")}{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
