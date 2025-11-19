import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState<string>(
  //   application.application_status || "review"
  // );
  const [status, setStatus] = useState("");
  const [citizenFile, setCitizenFile] = useState<File | null>(null);
  const [adminExtraFile, setAdminExtraFile] = useState<File | null>(null);
  const [adminPhotos, setAdminPhotos] = useState<FileList | null>(null);

  const availableStatuses = useMemo(() => {
    switch (application.application_status) {
      case "review":
        return ["accepted", "admin_approval", "not_completed"];
      case "accepted":
        return ["admin_approval", "not_completed", "review"];
      case "admin_approval":
        return ["accepted", "not_completed"];
      case "not_completed":
        return ["review"];
      default:
        return ["review", "accepted", "not_completed"];
    }
  }, [application.application_status]);

  const showDays = useMemo(() => {
    switch (status) {
      case "accepted":
      case "admin_approval":
      case "not_completed":
        return false;
      default:
        return true;
    }
  }, [status]);

  const showText = useMemo(() => {
    switch (status) {
      case "accepted":
      case "admin_approval":
        return false;
      default:
        return true;
    }
  }, [status]);
  const uploadFiles = async () => {
    const formData = new FormData();

    if (citizenFile) formData.append("citizen_file", citizenFile);
    if (adminExtraFile) formData.append("admin_extra_file", adminExtraFile);
    if (adminPhotos) {
      Array.from(adminPhotos).forEach((file) =>
        formData.append("admin_photos", file)
      );
    }

    if (
      formData.has("citizen_file") ||
      formData.has("admin_extra_file") ||
      formData.has("admin_photos")
    ) {
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.post(
        "/upload/application-files",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    }
    return null;
  };

  const handleSend = async () => {
    if (!application?.application_id) {
      toast.error(t("no_data"));
      return;
    }

    try {
      setLoading(true);

      const uploaded = await uploadFiles();

      const payload = {
        application_id: application.application_id,
        text: message,
        days: showDays ? Number(days || 0) : 0,
        status: status,
        citizen_file: uploaded?.citizen_file || null,
        admin_extra_file: uploaded?.admin_extra_file || null,
        admin_photos: uploaded?.admin_photos || null,
      };

      await axiosInstance.post("/organ/send_to_admin", payload);

      toast.success(t("successfully_sent"));
      setMessage("");
      setDays("");
      setCitizenFile(null);
      setAdminExtraFile(null);
      setAdminPhotos(null);
      onSendSuccess();
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error(t("sessionExpired"));
        navigate("/login");
      } else {
        toast.error(
          `${t("failed_to_send")}: ${err.response?.data?.detail || err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      {showText && (
        <div>
          <Label>{t("organText")}</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      )}

      {showDays && (
        <div>
          <Label>{t("days")}</Label>
          <Input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
      )}
      <div>
        <Label>{t("status")}</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 p-2 rounded-md border bg-muted/50 w-full"
        >
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {t(status)}
            </option>
          ))}
        </select>
      </div>

      {["admin_approval",].includes(status) && (
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <Label>{t("citizenFile")}</Label>
            <Input
              type="file"
              onChange={(e) =>
                setCitizenFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
          <div>
            <Label>{t("adminExtraFile")}</Label>
            <Input
              type="file"
              onChange={(e) =>
                setAdminExtraFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
          <div>
            <Label>{t("organFile")}</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => setAdminPhotos(e.target.files)}
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
