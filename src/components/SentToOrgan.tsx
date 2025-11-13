import React, { useState, useEffect, useMemo } from "react";
import { Upload } from "lucide-react";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: number;
  name: string;
  organization_id: number;
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
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [days, setDays] = useState<number | undefined>();
  const [status, setStatus] = useState(initialStatus);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgSuggestions, setOrgSuggestions] = useState<Organization[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setStatus(initialStatus), [initialStatus]);

const fetchOrganizations = async (query: string) => {
  if (!query.trim()) {
    setOrgSuggestions([]);
    return;
  }

  try {
    const res = await axiosInstance.get(`/admin/send_organ/get_orgs?org_name=${query}`);
    if (Array.isArray(res.data)) {
      const formattedOrgs = res.data.map((org: any) => ({
        ...org,
        organization_id: org.id,
      }));
      setOrgSuggestions(formattedOrgs);
    } else {
      setOrgSuggestions([]);
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error(t("sessionExpired"));
      navigate("/login");
    } else {
      console.error("fetchOrganizations error:", error);
      toast.error(t("fetchError"));
    }
  }
};


const handleSendOrgan = async () => {
  if (!selectedStatus) return toast.error(t("selectStatusWarning"));

  const payloadOrgId = orgId || (orgSuggestions.length > 0 ? orgSuggestions[0].organization_id : null);
  
  try {
    setLoading(true);
    await axiosInstance.post("/admin/send_organ", {
      application_id: application.application_id,
      org_id: payloadOrgId,
      text,
      status: selectedStatus,
      days: Number(days),
    });
    toast.success(t("sendSuccess"));
    setText("");
    setDays(undefined);
    setOrgName("");
    setOrgId(null);
    setSelectedStatus("");
    onSendSuccess();
  } catch (err: any) {
    if (err.response?.status === 401) {
      toast.error(t("sessionExpired"));
      navigate("/login");
    } else {
      toast.error(t("sendError"));
    }
  } finally {
    setLoading(false);
  }
};

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

  const getStatusOptions = () => {
    switch (status) {
      case "pending":
      case "review":
        return ["sent_to_organ", "not_completed"];
      case "admin_approval":
        return ["completed", "returned_to_organ", "not_completed"];
      case "sent_to_organ":
      case "not_completed":
      default:
        return ["sent_to_organ", "not_completed"];
    }
  };
  const showDays = useMemo(() => {
    switch (selectedStatus) {
      case "completed":
      case "not_completed":
        return false;
      default:
        return true;
    }
  }, [selectedStatus]);
  const showText = useMemo(() => {
    switch (selectedStatus) {
      case "completed":
      case "not_completed":
        return false;
      default:
        return true;
    }
  }, [selectedStatus]);
  return (
    <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t("sendToOrgan")}
        </h2>
      </div>
      <div className="p-5 space-y-4">
        {showText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("messageText")}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("writeMessageToOrgan")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {showDays && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("days")}
              </label>
              <input
                type="number"
                value={days || ""}
                onChange={(e) => setDays(Number(e.target.value))}
                placeholder="0"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("status")}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
            >
              <option value="">{t("status_tanlash")}</option>
              {getStatusOptions().map((opt) => (
                <option key={opt} value={opt}>
                  {t(opt)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {status==="pending" &&(
          <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("organization")}
          </label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => {
              const val = e.target.value;
              setOrgName(val);
              setShowSuggestions(true);
              fetchOrganizations(val);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={t("enterOrganizationName")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100"
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
        )}
        
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
