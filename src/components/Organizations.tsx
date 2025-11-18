import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/api";
import AddOrganizationDrawer from "./AddOrganization";
import EditOrganizationDrawer from "./OrganizationEdit";
import DeleteOrganizationDrawer from "./OrganizationDelete";
import { useTranslation } from "react-i18next";
import WarningModal from "./WarningModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
interface Organization {
  id: number;
  name: string;
  createdAt?: string;
}

const OrganizationsTable: React.FC = () => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warnings, setWarnings] = useState<any>({});
  const [selectedOrg, setSelectedOrg] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [theme, _setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/admin/warning/apps", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setWarnings(res.data);
          setShowWarning(true);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          console.error("Warning fetch error:", err);
        }
      }
    };

    fetchWarnings();
  }, []);
  const fetchOrganizations = () => {
    axiosInstance
      .get("/organization/organization", { params: { page } })
      .then((response) => {
        const data = response.data.items || [];
        setOrganizations(data);
        setPagination(response.data.pagination);
      })
      .catch((error: any) => {
        if (error.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          console.error(
            "There was an error fetching the organizations!",
            error
          );
        }
      });
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#101922] text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        data={warnings}
      />
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-2xl font-bold">{t("organizations")}</h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md ml-2"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="text-lg font-bold">+</span> {t("addOrganization")}
          </button>
        </div>
      </div>
      <hr
        className={
          theme === "dark" ? "border-gray-700 my-4" : "border-gray-300 my-4"
        }
      />
      <div
        className={`rounded-xl shadow-lg overflow-hidden mt-6 border transition-colors ${
          theme === "dark"
            ? "bg-[#1a2533] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <table className="w-full">
          <thead>
            <tr
              className={`text-left text-xs uppercase font-semibold flex justify-between px-8 ${
                theme === "dark"
                  ? "bg-[#1e2a3a] text-gray-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <th className="py-3 px-4">{t("name")}</th>
              {/* <th className="py-3 px-4">{t("createdAt")}</th> */}
              <th className="py-3 px-6">{t("actions")}</th>
            </tr>
          </thead>
          <tbody
            className={
              theme === "dark" ? "divide-gray-800" : "divide-gray-200 divide-y"
            }
          >
            {organizations.map((org) => (
              <tr
                key={org.id}
                className={`transition-colors flex justify-between px-8 border-b-2 ${
                  theme === "dark" ? "hover:bg-[#223044]" : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 font-medium">{org.name}</td>
                {/* <td className="py-3 px-4">{org.createdAt || "—"}</td> */}
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button
                      className={`text-sm font-medium ${
                        theme === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      onClick={() => {
                        setSelectedOrg(org);
                        setDeleteOpen(true);
                      }}
                    >
                      {t("delete")}
                    </button>
                    <span>|</span>
                    <button
                      className={`text-sm font-medium ${
                        theme === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                      onClick={() => {
                        setSelectedOrg(org);
                        setEditOpen(true);
                      }}
                    >
                      {t("edit")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {organizations.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 italic text-gray-500"
                >
                  {t("noOrganizations")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className={`px-4 py-2 rounded-md disabled:opacity-50 ${
              theme === "dark"
                ? "bg-[#1e2a3a] text-gray-300 hover:bg-[#24344a]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {t("previous")}
          </button>
          <span>
            {t("pageInfo", {
              current: pagination.current_page,
              total: pagination.total_pages,
            })}
          </span>
          <button
            className={`px-4 py-2 rounded-md disabled:opacity-50 ${
              theme === "dark"
                ? "bg-[#1e2a3a] text-gray-300 hover:bg-[#24344a]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            disabled={page >= pagination.total_pages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            {t("next")}
          </button>
        </div>
      )}
      <AddOrganizationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={fetchOrganizations}
      />
      {selectedOrg && (
        <EditOrganizationDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          orgId={selectedOrg.id}
          currentName={selectedOrg.name}
          onUpdated={fetchOrganizations}
        />
      )}
      {selectedOrg && (
        <DeleteOrganizationDrawer
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          orgId={selectedOrg.id}
          orgName={selectedOrg.name}
          onDeleted={fetchOrganizations}
        />
      )}
    </div>
  );
};

export default OrganizationsTable;
