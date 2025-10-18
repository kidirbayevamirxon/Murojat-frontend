import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Organization {
  id: number;
  name: string;
}

interface Application {
  application_id: number;
  organ_text?: string;
  organ_deadline_time?: string;
}

interface SendToOrganProps {
  application: Application;
  initialStatus?: string;
  onSendSuccess: () => void;
}

const SendToOrgan: React.FC<SendToOrganProps> = ({
  application,
  initialStatus = "not_completed",
  onSendSuccess,
}) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [days, setDays] = useState<number | undefined>(0);
  const [status, setStatus] = useState(initialStatus);
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgSuggestions, setOrgSuggestions] = useState<Organization[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const fetchOrganizations = async (query: string) => {
    if (!query.trim()) {
      setOrgSuggestions([]);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/admin/send_organ/get_orgs?org_name=${query}`
      );
      if (Array.isArray(res.data)) {
        setOrgSuggestions(res.data);
      } else {
        setOrgSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrgSuggestions([]);
    }
  };

  const handleSendOrgan = async () => {
    if (!application) return;

    try {
      setLoading(true);
      await axiosInstance.post("/admin/send_organ", {
        application_id: application.application_id,
        org_id: Number(orgId),
        text,
        status,
        days: Number(days),
      });
      toast.success(t("sendSuccess"));
      setText("");
      setOrgId(null);
      setDays(undefined);
      onSendSuccess();
    } catch (err) {
      console.error("Error sending application:", err);
      toast.error(t("sendError"));
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

  return (
    <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-fit transition-colors">
      <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t("sendToOrgan")}
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("messageText")}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("writeMessageToOrgan")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("days")}
            </label>
            <input
              type="text"
              value={days || ""}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("status")}
            </label>

            {status === "pending" && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
              >
                <option value="sent_to_organ">{t("sent_to_organ")}</option>
                <option value="not_completed">{t("not_completed")}</option>
              </select>
            )}
            {status === "review" && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
              >
                <option value="not_completed">{t("not_completed")}</option>
                <option value="sent_to_organ">{t("sent_to_organ")}</option>
              </select>
            )}
            {status === "admin_approval" && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
              >
                <option value="completed">{t("completed")}</option>
                <option value="returned_to_organ">
                  {t("returned_to_organ")}
                </option>
                <option value="not_completed">{t("not_completed")}</option>
              </select>
            )}
          </div>
          <div className="relative col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("organization")}
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => {
                const value = e.target.value;
                setOrgName(value);
                setShowSuggestions(true);
                fetchOrganizations(value);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={t("enterOrganizationName")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            />

            {showSuggestions && orgSuggestions.length > 0 && (
              <ul className="absolute z-50 bg-white dark:bg-[#1a2533] border border-gray-200 dark:border-gray-700 rounded-lg mt-1 w-full shadow-lg max-h-48 overflow-auto">
                {orgSuggestions.map((org) => (
                  <li
                    key={org.id}
                    onClick={() => {
                      setOrgName(org.name);
                      setOrgId(org.id);
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition"
                  >
                    {org.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleSendOrgan}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          <Upload size={16} />
          {loading ? t("sending") : t("sendToOrganButton")}
        </button>

        {application.organ_text && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("currentOrganInfo")}
            </h3>
            <div className="bg-gray-50 dark:bg-[#141c27] p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">{t("organText")}:</span>{" "}
                {application.organ_text}
              </p>
              {application.organ_deadline_time && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{t("organDeadline")}:</span>{" "}
                  {formatDateTime(application.organ_deadline_time)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendToOrgan;
