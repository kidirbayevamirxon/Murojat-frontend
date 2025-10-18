import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { useTranslation } from "react-i18next";

interface Applications {
  not_completed: number;
  pending: number;
  sent_to_organ: number;
  completed: number;
  review: number;
  accepted: number;
  admin_approval: number;
  expired_closed: number;
  returned_to_organ: number;
}

interface Organization {
  organization_id: number;
  organization_name: string;
  applications: Applications;
}

interface ApiResponse {
  data: Organization[];
  total_pages: number;
  total_count: number;
}

export default function AdminStatistics() {
  const { t } = useTranslation();
  const [data, setData] = useState<ApiResponse>({
    data: [],
    total_pages: 1,
    total_count: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/admin/statistics?page=${page}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData({
            data: res.data,
            total_pages: 1,
            total_count: res.data.length,
          });
        } else {
          setData(res.data);
        }
      })
      .catch(() =>
        setData({
          data: [],
          total_pages: 1,
          total_count: 0,
        })
      )
      .finally(() => setLoading(false));
  }, [page]);

  const orgs = Array.isArray(data.data) ? data.data : [];
  const filtered = orgs.filter((org) =>
    org.organization_name.toLowerCase().includes(search.toLowerCase())
  );

  const getTotal = (apps: Applications) =>
    Object.values(apps || {}).reduce((a, b) => a + b, 0);

  return (
    <div
      className="p-6 min-h-screen transition-all"
      style={{ backgroundColor: "#101922", color: "#E4E9F2" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#E4E9F2]">
          {t("organizationStatistics")}
        </h1>
        <Button
          className="
            bg-blue-600 hover:bg-blue-700
            text-white font-medium shadow-sm px-4 py-2 rounded-md
            transition-colors
          "
          onClick={async () => {
            try {
              const lang = localStorage.getItem("lang") || "en";
              const res = await axiosInstance.get(
                `/admin/statistics/excel?lang=${lang}`,
                { responseType: "blob" }
              );
              const contentDisposition = res.headers["content-disposition"];
              let filename = "statistics.xlsx";
              if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) filename = match[1];
              }
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", filename);
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) {
              console.error("Excel eksportda xatolik:", err);
              alert(t("exportError"));
            }
          }}
        >
          {t("exportExcel")}
        </Button>
      </div>
      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t("searchOrganization")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-[#1A2433] border border-[#2B3648]
            text-[#E4E9F2] placeholder:text-gray-400
            shadow-sm pl-10 pr-4 py-2
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all
          "
        />
      </div>
      <Card
        className="rounded-xl overflow-hidden border shadow-lg"
        style={{ backgroundColor: "#1A2433", borderColor: "#2B3648" }}
      >
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-6 text-center"
              style={{ color: "#A0AEC0", backgroundColor: "#1A2433" }}
            >
              {t("loading")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: "#1F2A3A" }}>
                  <tr className="text-gray-300 border-b border-[#2B3648]">
                    <th className="py-4 px-4 text-left font-semibold text-[#E4E9F2] min-w-[200px]">
                      {t("organizationName")}
                    </th>
                    <th className="py-4 px-4 text-center text-yellow-400">
                      {t("not_completed")}
                    </th>
                    <th className="py-4 px-4 text-center text-blue-400">
                      {t("pending")}
                    </th>
                    <th className="py-4 px-4 text-center text-indigo-400">
                      {t("sent_to_organ")}
                    </th>
                    <th className="py-4 px-4 text-center text-green-400">
                      {t("completed")}
                    </th>
                    <th className="py-4 px-4 text-center text-purple-400">
                      {t("review")}
                    </th>
                    <th className="py-4 px-4 text-center text-emerald-400">
                      {t("accepted")}
                    </th>
                    <th className="py-4 px-4 text-center text-pink-400">
                      {t("admin_approval")}
                    </th>
                    <th className="py-4 px-4 text-center text-gray-400">
                      {t("expired_closed")}
                    </th>
                    <th className="py-4 px-4 text-center text-orange-400">
                      {t("returned_to_organ")}
                    </th>
                    <th className="py-4 px-4 text-center text-blue-400 font-semibold">
                      {t("total")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center py-8 text-gray-400"
                        style={{ backgroundColor: "#1A2433" }}
                      >
                        {t("noOrganizations")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((org, i) => (
                      <tr
                        key={org.organization_id}
                        onClick={() =>
                          navigate(`/statistics/${org.organization_id}`)
                        }
                        className="cursor-pointer transition-all"
                        style={{
                          backgroundColor: i % 2 === 0 ? "#1A2433" : "#18212E",
                        }}
                      >
                        <td className="py-4 px-4 font-medium text-[#E4E9F2] hover:text-blue-400">
                          {org.organization_name}
                        </td>
                        <td className="py-4 px-4 text-center text-yellow-400">
                          {org.applications.not_completed}
                        </td>
                        <td className="py-4 px-4 text-center text-blue-400">
                          {org.applications.pending}
                        </td>
                        <td className="py-4 px-4 text-center text-indigo-400">
                          {org.applications.sent_to_organ}
                        </td>
                        <td className="py-4 px-4 text-center text-green-400">
                          {org.applications.completed}
                        </td>
                        <td className="py-4 px-4 text-center text-purple-400">
                          {org.applications.review}
                        </td>
                        <td className="py-4 px-4 text-center text-emerald-400 font-semibold">
                          {org.applications.accepted}
                        </td>
                        <td className="py-4 px-4 text-center text-pink-400 font-semibold">
                          {org.applications.admin_approval}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-400">
                          {org.applications.expired_closed}
                        </td>
                        <td className="py-4 px-4 text-center text-orange-400">
                          {org.applications.returned_to_organ}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-blue-400">
                          {getTotal(org.applications)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {!loading && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
            totalItems={data.total_count}
            filteredItems={filtered.length}
          />
        </div>
      )}
    </div>
  );
}
