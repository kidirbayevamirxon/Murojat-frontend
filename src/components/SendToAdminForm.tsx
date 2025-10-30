import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const [status, _setStatus] = useState(application.application_status);
  const [day, setDay] = useState<string>("");
  const [citizenFile, setCitizenFile] = useState<File | null>(null);
  const [organFile, setOrganFile] = useState<File | null>(null);
  const [adminExtraFile, setAdminExtraFile] = useState<File | null>(null);
  const [adminPhotos, setAdminPhotos] = useState<File[]>([]);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const navigate = useNavigate();
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
      if (organFile) formData.append("organ_file", organFile);
      if (adminExtraFile) formData.append("admin_extra_file", adminExtraFile);
      adminPhotos.forEach((p) => formData.append("admin_photos", p));
      extraFiles.forEach((f) => formData.append("extra_files", f));
      await axiosInstance.post("/organ/send_to_admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("messageSentSuccess"));
      setMessage("");
      setCitizenFile(null);
      setOrganFile(null);
      setAdminExtraFile(null);
      setAdminPhotos([]);
      setExtraFiles([]);
      onSendSuccess();
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error(t("sessionExpired"));
        navigate("/login");
      } else {
        toast.error(err.response?.data?.detail || t("sendFailed"));
        console.error("Send error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t pt-3 dark:border-gray-700">
      {(status === "sent_to_organ" ||
        status === "review" ||
        status === "accepted" ||
        status === "admin_approval" ||
        status === "returned_to_organ") && (
        <div className="flex flex-col gap-2">
          <label className="font-medium">{t("organText")}</label>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      )}
      {(status === "sent_to_organ" ||
        status === "review" ||
        status === "returned_to_organ") && (
        <div className="flex flex-col gap-2">
          <label className="font-medium">{t("days")}</label>
          <Input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            inputMode="numeric"
          />
        </div>
      )}
      {(status === "accepted" || status === "admin_approval") && (
        <div className="flex flex-col gap-4 mt-3">
          <div>
            <label className="font-medium">{t("citizenFile")}</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCitizenFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="font-medium">{t("organFile")}</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setOrganFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="font-medium">{t("adminExtraFile")}</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.zip"
              onChange={(e) => setAdminExtraFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="font-medium">{t("adminPhotos")}</label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setAdminPhotos(Array.from(e.target.files || []))}
            />
          </div>

          <div>
            <label className="font-medium">{t("extraFiles")}</label>
            <Input
              type="file"
              multiple
              onChange={(e) => setExtraFiles(Array.from(e.target.files || []))}
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleSend}
        disabled={loading}
        className="mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white w-full rounded-lg"
      >
        {loading ? t("sending") : t("sendMessage")}
      </Button>
    </div>
  );
}
