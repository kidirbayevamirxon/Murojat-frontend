import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Organization Application Statistics
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 transition-colors"
            onClick={async () => {
              try {
                const lang = localStorage.getItem("lang") || "en";
                const res = await axiosInstance.get(
                  `/admin/statistics/excel?lang=${lang}`,
                  {
                    responseType: "blob",
                  }
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
                alert("Faylni yuklab olishda xatolik yuz berdi!");
              }
            }}
          >
            Export as xlsx
          </Button>
        </div>
      </div>
      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search for an organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 shadow-sm pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      <Card className="border border-gray-200 shadow-md rounded-xl overflow-hidden">
  <CardContent className="p-0">
    {loading ? (
      <div className="p-6 text-center text-gray-500 bg-white">Loading...</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-4 text-left font-semibold text-gray-700 min-w-[200px]">
                Organization Name
              </th>
              <th className="py-4 px-4 text-center font-semibold text-indigo-700 ">
                Not Completed
              </th>
              <th className="py-4 px-4 text-center font-semibold text-yellow-600">
                Pending
              </th>
              <th className="py-4 px-4 text-center font-semibold text-blue-600">
                Sent to Org
              </th>
              <th className="py-4 px-4 text-center font-semibold text-green-600">
                Completed
              </th>
              <th className="py-4 px-4 text-center font-semibold text-purple-600">
                Review
              </th>
              <th className="py-4 px-4 text-center font-semibold text-emerald-700">
                Accepted
              </th>
              <th className="py-4 px-4 text-center font-semibold text-pink-600">
                Admin Approval
              </th>
              <th className="py-4 px-4 text-center font-semibold text-gray-600">
                Expired Closed
              </th>
              <th className="py-4 px-4 text-center font-semibold text-orange-600">
                Returned
              </th>
              <th className="py-4 px-4 text-center font-semibold text-indigo-800">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-8 text-gray-500 bg-white"
                >
                  No organizations found
                </td>
              </tr>
            ) : (
              filtered.map((org, i) => (
                <tr
                  key={org.organization_id}
                  onClick={() =>
                    navigate(`/statistics/${org.organization_id}`)
                  }
                  className={`border-b border-gray-100 cursor-pointer transition-all ${
                    i % 2 === 0
                      ? "bg-white hover:bg-indigo-50"
                      : "bg-gray-50 hover:bg-indigo-100"
                  }`}
                >
                  <td className="py-4 px-4 font-medium text-gray-700 hover:text-indigo-900">
                    {org.organization_name}
                  </td>
                  <td className="py-4 px-4 text-center text-indigo-700 font-medium">
                    {org.applications.not_completed}
                  </td>
                  <td className="py-4 px-4 text-center text-yellow-700 font-medium">
                    {org.applications.pending}
                  </td>
                  <td className="py-4 px-4 text-center text-blue-700 font-medium">
                    {org.applications.sent_to_organ}
                  </td>
                  <td className="py-4 px-4 text-center text-green-700 font-medium">
                    {org.applications.completed}
                  </td>
                  <td className="py-4 px-4 text-center text-purple-700 font-medium">
                    {org.applications.review}
                  </td>
                  <td className="py-4 px-4 text-center text-emerald-700 font-semibold">
                    {org.applications.accepted}
                  </td>
                  <td className="py-4 px-4 text-center text-pink-700 font-semibold">
                    {org.applications.admin_approval}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium">
                    {org.applications.expired_closed}
                  </td>
                  <td className="py-4 px-4 text-center text-orange-700 font-medium">
                    {org.applications.returned_to_organ}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-indigo-900">
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
