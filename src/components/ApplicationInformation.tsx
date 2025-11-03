import { useState, useEffect } from "react";
import { axiosInstance } from "@/api/api";
import SendToOrgan from "./SentToOrgan";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building,
  Image,
  File,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ApplicationInformation = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [_orgName, setOrgName] = useState("");
  const [_orgId, setOrgId] = useState<number | null>(null);
  const [theme, _setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/app_send_organ?app_id=${id}`
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setApplication(response.data[0]);
      } else {
        setApplication(null);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      setError(t("loadError"));
    }
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axiosInstance.get("/admin/send_organ/get_orgs");
        if (Array.isArray(res.data)) {
          setOrgName(res.data[0]?.name || "");
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchOrgs();
  }, []);

  const getFileIcon = (fileName: string, fileUrl: string) => {
    if (isImageFile(fileName)) {
      return (
        <div className="relative group">
          <div
            className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            onClick={() => setSelectedImage(fileUrl)}
          >
            <Image size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition" />
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <div className="bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
              {t("view")}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <File size={24} className="text-gray-400 dark:text-gray-500" />
        </div>
      );
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  useEffect(() => {
    if (application?.organization_id) {
      setOrgId(application.organization_id);
    }
  }, [application]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

  const getStatusBadge = (status: string) => {
    const map: any = {
      not_completed:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    const label = t(status);
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${map[status]}`}>
        {label}
      </span>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 text-center dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg">
          {t("loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101922] text-gray-900 dark:text-gray-100 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("applicationDetails")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              APP-{application.application_id} - {application.full_name}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white dark:bg-[#1a2533] text-gray-700 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1e2a38] flex items-center gap-2 transition"
          >
            <ArrowLeft size={16} /> {t("backToList")}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <User size={18} />
                  {t("applicantInformation")}
                </h2>
              </div>
              <div className="p-5">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400 w-1/3">
                        {t("fullName")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                        {application.full_name}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                        {t("inn")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                        {application.inn}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                        {t("personal_buzines_name")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                        {application.personal_buzines_name}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                        {t("phone")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                        {application.phone}
                      </td>
                    </tr>
                    {application.additional_phone && (
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                          {t("additionalPhone")}
                        </td>
                        <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                          {application.additional_phone || "—"}
                        </td>
                      </tr>
                    )}
                    {application.organization_name && (
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                          {t("organization")}
                        </td>
                        <td className="py-3 px-2 text-gray-800 dark:text-gray-100 flex items-center gap-1">
                          <Building size={14} />
                          {application.organization_name || "—"}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                        {t("quarter")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">
                        {application.quarter_name || "—"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                        {t("createdAt")}
                      </td>
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100 flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateTime(application.creat_at)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("status")}:
                    </span>
                    {getStatusBadge(application.application_status)}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={async () => {
                        const lang = localStorage.getItem("lang") || "uz";
                        const url = `https://f2f2a56a78e0.ngrok-free.app/admin/${application.id}/export-word?lang=${lang}`;

                        const response = await fetch(url, {
                          headers: { "ngrok-skip-browser-warning": "true" },
                        });
                        const blob = await response.blob();
                        const contentDisposition = response.headers.get(
                          "content-disposition"
                        );
                        const filenameMatch =
                          contentDisposition?.match(/filename="?([^"]+)"?/);
                        const filename = filenameMatch
                          ? filenameMatch[1]
                          : "application.docx";

                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      {t("downloadWord")}
                    </button>
                    <button
                      onClick={async () => {
                        const url = `https://f2f2a56a78e0.ngrok-free.app/admin/files/pdf-no-org?app_id=${application.id}`;

                        const response = await fetch(url, {
                          headers: { "ngrok-skip-browser-warning": "true" },
                        });
                        const blob = await response.blob();
                        const contentDisposition = response.headers.get(
                          "content-disposition"
                        );
                        const filenameMatch =
                          contentDisposition?.match(/filename="?([^"]+)"?/);
                        const filename = filenameMatch
                          ? filenameMatch[1]
                          : "application.pdf";

                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      {t("downloadPDF")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("history")}
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {t("applicationCreated")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(application.creat_at)}
                      </p>
                    </div>
                  </div>
                  {application.sent_time && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {t("sentToOrgan")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(application.sent_time)}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.deadline_time && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {t("deadline")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(application.deadline_time)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("textInformation")}
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("userText")}
                  </label>
                  <div className="bg-gray-50 dark:bg-[#141c27] p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[60px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                      {application.user_text || t("noUserText")}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("adminText")}
                  </label>
                  <div className="bg-gray-50 dark:bg-[#141c27] p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[60px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                      {application.text || t("noAdminText")}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("organText")}
                  </label>
                  <div className="bg-gray-50 dark:bg-[#141c27] p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[60px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                      {application.organ_text || t("noOrganText")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a2533] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="bg-gray-50 dark:bg-[#141c27] px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <FileText size={18} />
                  {t("attachments")}
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {application.file_url && (
                    <div className="flex gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {getFileIcon("file_url", application.file_url)}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {t("mainFile")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("mainFileDescription")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedImage(application.file_url)}
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          {t("view")}
                        </button>
                      </div>
                    </div>
                  )}
                  {application.citizen_file && (
                    <div className="flex gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {getFileIcon("citizen_file", application.citizen_file)}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {t("citizenFile")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("citizenFileDescription")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setSelectedImage(application.citizen_file)
                          }
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          {t("view")}
                        </button>
                      </div>
                    </div>
                  )}
                  {application.admin_extra_file && (
                    <div className="flex gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {getFileIcon(
                        "admin_extra_file",
                        application.admin_extra_file
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {t("adminExtraFile")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("adminExtraFileDescription")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setSelectedImage(application.admin_extra_file)
                          }
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          {t("view")}
                        </button>
                      </div>
                    </div>
                  )}
                  {application.admin_photos &&
                  application.admin_photos.length > 0 ? (
                    application.admin_photos.map(
                      (photo: string, index: number) => (
                        <div
                          key={index}
                          className="flex gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          {getFileIcon(`photo_${index}`, photo)}
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {t("adminPhoto")} {index + 1}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("adminPhotoDescription")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedImage(photo)}
                              className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition flex items-center gap-1"
                            >
                              <Image size={14} />
                              {t("view")}
                            </button>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      {t("noAttachments")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {![
            "completed",
            "not_completed",
            "accepted",
            "returned_to_organ",
            "expired_closed",
          ].includes(application.application_status) && (
            <SendToOrgan
              application={application}
              initialStatus={application.application_status}
              onSendSuccess={fetchApplicationDetails}
            />
          )}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white dark:bg-[#1a2533] rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-[95vw] md:w-[80vw] max-h-[90vh] flex flex-col items-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selectedImage || "") ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-auto h-[85vh] object-contain"
              />
            ) : (
              <iframe
                src={selectedImage}
                className="w-full h-[85vh] border-none"
                title="File Preview"
              />
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <a
                href={selectedImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg shadow hover:bg-blue-700 transition-all active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                {t("download")}
              </a>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all active:scale-95"
                title={t("close")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationInformation;
