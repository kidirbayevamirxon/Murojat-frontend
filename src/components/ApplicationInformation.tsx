import { useState, useEffect } from "react";
import { axiosInstance } from "@/api/api";
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  User,
  Building,
  Image,
  File,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ApplicationInformation = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [days, setDays] = useState<number | undefined>(0);
  const [status, setStatus] = useState("not_completed");
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgSuggestions, setOrgSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError("Failed to load application details.");
    }
  };
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
      toast.success("Application sent successfully!");
      setText("");
      setOrgId(null);
      setDays(undefined);
      fetchApplicationDetails();
      window.history.back();
    } catch (err) {
      console.error("Error sending application:", err);
      toast.error("Failed to send application!");
    } finally {
      setLoading(false);
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
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrgs();
  }, []);

  const getFileIcon = (fileName: string, fileUrl: string) => {
    if (isImageFile(fileName)) {
      return (
        <div className="relative group">
          <div
            className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setSelectedImage(fileUrl)}
          >
            <Image size={24} className="text-gray-400" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition" />
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <div className="bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
              Ko'rish
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
          <File size={24} className="text-gray-400" />
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
    const statusConfig: any = {
      not_completed: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Not Completed",
      },
      pending: { color: "bg-blue-100 text-blue-800", label: "Pending" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    };

    const config = statusConfig[status] || statusConfig["not_completed"];
    return (
      <span className={`px-2 py-1 ${config.color} text-xs font-medium rounded`}>
        {config.label}
      </span>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
          Application not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Application Details
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              APP-{application.application_id} - {application.full_name}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <ArrowLeft size={16} /> Back to list
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User size={18} />
                  Applicant Information
                </h2>
              </div>
              <div className="p-5">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-medium text-gray-600 w-1/3">
                        Full Name
                      </td>
                      <td className="py-3 px-2 text-gray-800">
                        {application.full_name}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-medium text-gray-600">
                        Phone
                      </td>
                      <td className="py-3 px-2 text-gray-800">
                        {application.phone}
                      </td>
                    </tr>
                    {application.additional_phone && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-2 font-medium text-gray-600">
                          Additional Phone
                        </td>
                        <td className="py-3 px-2 text-gray-800">
                          {application.additional_phone || "—"}
                        </td>
                      </tr>
                    )}
                    {application.organization_name && (
                      <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-medium text-gray-600">
                        Organization
                      </td>
                      <td className="py-3 px-2 text-gray-800 flex items-center gap-1">
                        <Building size={14} />
                        {application.organization_name || "—"}
                      </td>
                    </tr>
                    )}
                    
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-2 font-medium text-gray-600">
                        Quarter
                      </td>
                      <td className="py-3 px-2 text-gray-800">
                        {application.quarter_name || "—"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-gray-600">
                        Created Date
                      </td>
                      <td className="py-3 px-2 text-gray-800 flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateTime(application.creat_at)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Status:</span>
                    {getStatusBadge(application.application_status)}
                  </div>
                  {/* Yuklab olish tugmalari */}
<div className="flex gap-3 pt-4">
  <button
    onClick={async () => {
      const lang = localStorage.getItem("lang") || "uz";
      const url = `https://f2f2a56a78e0.ngrok-free.app/admin/${application.id}/export-word?lang=${lang}`;

      const response = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : "application.docx";

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
  >
    Word yuklab olish
  </button>

  <button
    onClick={async () => {
      const url = `https://f2f2a56a78e0.ngrok-free.app/admin/files/pdf-no-org?app_id=${application.id}`;

      const response = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : "application.pdf";

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
  >
    PDF yuklab olish
  </button>
</div>

                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">History</h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-800">
                        Application Created
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(application.creat_at)}
                      </p>
                    </div>
                  </div>
                  {application.sent_time && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-800">
                          Sent to Organ
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(application.sent_time)}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.deadline_time && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Deadline</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(application.deadline_time)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Text Information
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Text
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[60px]">
                    <p className="text-gray-700 whitespace-pre-line break-words">
                      {application.user_text || "No user text provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Text
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[60px]">
                    <p className="text-gray-700 whitespace-pre-line break-words">
                      {application.text || "No admin text provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organ Text
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[60px]">
                    <p className="text-gray-700 whitespace-pre-line break-words">
                      {application.organ_text || "No organ text provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText size={18} />
                  Attachments
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {application.file_url && (
                    <div className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                      {getFileIcon("file_url", application.file_url)}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800">Main File</p>
                        <p className="text-sm text-gray-500">
                          Fuqaro tomonidan asosiy yuklangan fayl
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedImage(application.file_url)}
                          className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          Ko‘rish
                        </button>
                      </div>
                    </div>
                  )}
                  {application.citizen_file && (
                    <div className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                      {getFileIcon("citizen_file", application.citizen_file)}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800">
                          Citizen File
                        </p>
                        <p className="text-sm text-gray-500">
                          Fuqaro tomonidan yuklangan fayl
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setSelectedImage(application.citizen_file)
                          }
                          className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          Ko‘rish
                        </button>
                      </div>
                    </div>
                  )}
                  {application.admin_extra_file && (
                    <div className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                      {getFileIcon(
                        "admin_extra_file",
                        application.admin_extra_file
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-gray-800">
                          Admin Extra File
                        </p>
                        <p className="text-sm text-gray-500">
                          Admin tomonidan qo‘shimcha fayl
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setSelectedImage(application.admin_extra_file)
                          }
                          className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <Image size={14} />
                          Ko‘rish
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
                          className="flex gap-4 p-3 border border-gray-200 rounded-lg"
                        >
                          {getFileIcon(`photo_${index}`, photo)}
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-medium text-gray-800">
                              Admin Photo {index + 1}
                            </p>
                            <p className="text-sm text-gray-500">
                              Admin tomonidan yuklangan rasm
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedImage(photo)}
                              className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded hover:bg-green-100 transition flex items-center gap-1"
                            >
                              <Image size={14} />
                              Ko‘rish
                            </button>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No attachments available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-fit">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Send to Organ
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write message to organ..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days
                  </label>
                  <input
                    type="text"
                    value={days || ""}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="not_completed">Not Completed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
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
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Enter organization name..."
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />

                  {showSuggestions && orgSuggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 w-full shadow-lg max-h-48 overflow-auto">
                      {orgSuggestions.map((org) => (
                        <li
                          key={org.id}
                          onClick={() => {
                            setOrgName(org.name);
                            setOrgId(org.id);
                            setShowSuggestions(false);
                          }}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition"
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
                {loading ? "Sending..." : "Send to Organ"}
              </button>
              {application.organ_text && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Current Organ Information
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Organ Text:</span>{" "}
                      {application.organ_text}
                    </p>
                    {application.organ_deadline_time && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Organ Deadline:</span>{" "}
                        {formatDateTime(application.organ_deadline_time)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-[95vw] md:w-[80vw] max-h-[90vh] flex flex-col items-center animate-scaleIn"
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
                Yuklab olish
              </a>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all active:scale-95"
                title="Yopish"
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
