import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/api";
import AddQuarterDrawer from "../components/AddQuarter";
import EditQuarterDrawer from "../components/QuarterEdit";
import DeleteQuarterDrawer from "../components/QuraterDelete";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Quarter {
  id: number;
  name: string;
  createdAt?: string;
}

const QuarterTable: React.FC = () => {
  const { t } = useTranslation();

  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [theme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    navigate("/login");
  }
  const fetchQuarters = () => {
    axiosInstance
      .get("/quarter/quarter", { params: { page } })
      .then((response) => {
        const data = response.data.items || [];
        setQuarters(data);
        setPagination(response.data.pagination);
      })
      .catch((error: any) => {
        if (error.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          console.error("Quarterlarni olishda xatolik!", error);
        }
      });
  };
  useEffect(() => {
    fetchQuarters();
  }, [page]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#101922] text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-2xl font-bold">{t("quarters")}</h1>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md ml-2"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="text-lg font-bold">+</span>
          {t("addQuarter")}
        </button>
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
              <th className="py-3 px-6">{t("actions")}</th>
            </tr>
          </thead>
          <tbody
            className={
              theme === "dark" ? "divide-gray-800" : "divide-gray-200 divide-y"
            }
          >
            {quarters.map((q) => (
              <tr
                key={q.id}
                className={`transition-colors flex justify-between px-8 border-b-2 ${
                  theme === "dark" ? "hover:bg-[#223044]" : "hover:bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 font-medium">{q.name}</td>

                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button
                      className={`text-sm font-medium ${
                        theme === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      onClick={() => {
                        setSelectedQuarter(q);
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
                        setSelectedQuarter(q);
                        setEditOpen(true);
                      }}
                    >
                      {t("edit")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {quarters.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="text-center py-6 italic text-gray-500"
                >
                  {t("noQuarters")}
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
      <AddQuarterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={fetchQuarters}
      />
      {selectedQuarter && (
        <EditQuarterDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          quarterId={selectedQuarter.id}
          currentName={selectedQuarter.name}
          onUpdated={fetchQuarters}
        />
      )}
      {selectedQuarter && (
        <DeleteQuarterDrawer
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          quarterId={selectedQuarter.id}
          quarterName={selectedQuarter.name}
          onDeleted={fetchQuarters}
        />
      )}
    </div>
  );
};

export default QuarterTable;
