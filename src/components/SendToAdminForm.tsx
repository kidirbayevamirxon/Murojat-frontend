import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";

interface SendToAdminFormProps {
  application: {
    application_id: number;
    application_status: string;
  };
  onSendSuccess: () => void;
}

export default function SendToAdminForm({
  application,
  onSendSuccess,
}: SendToAdminFormProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(application.application_status);
  const [citizenFile, setCitizenFile] = useState<File | null>(null);
  const [adminExtraFile, setAdminExtraFile] = useState<File | null>(null);
  const [adminPhotos, setAdminPhotos] = useState<File[]>([]);
  const [day, setDay] = useState<string>("");

  const handleSend = async () => {
    if (!application) {
      toast.error(t("noDataLoaded"));
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("application_id", application.application_id.toString());
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
      onSendSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || t("sendFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-t pt-3 dark:border-gray-700">
      <div className="flex gap-2 items-center">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("status")}:
          </label>
          {status === "sent_to_organ" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            >
              {" "}
              <option value="accepted">{t("accepted")}</option>
              <option value="review">{t("review")}</option>
            </select>
          )}
          {status === "accepted" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            >
              {" "}
              <option value="admin_approval">{t("admin_approval")}</option>
              <option value="review">{t("review")}</option>
            </select>
          )}
          {status === "returned_to_organ" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            >
              {" "}
              <option value="admin_approval">{t("admin_approval")}</option>
              <option value="review">{t("review")}</option>
            </select>
          )}
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
            <option value="returned_to_organ">{t("returned_to_organ")}</option>
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
        {loading ? t("sending") : t("sendMessage")}
      </Button>
    </div>
  );
}
