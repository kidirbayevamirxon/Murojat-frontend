import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Calendar from "./Calendar";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Applications {
  [key: string]: number;
}

interface OrganizationDetail {
  organization_id: number;
  organization_name: string;
  applications: Applications;
}

export default function AdminStatisticsDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrganizationDetail | null>(null);

  useEffect(() => {
    const fetchOrgStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/statistics");
        const found = res.data.find(
          (o: OrganizationDetail) => o.organization_id === Number(id)
        );
        setOrg(found);
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi.");
          console.error("Statistics fetch error:", error);
        }
      }
    };

    if (id) fetchOrgStats();
  }, [id, navigate]);

  if (!org)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#101922] text-gray-600 dark:text-gray-300 text-lg">
        {t("loading")}
      </div>
    );

  const chartData = Object.keys(org.applications).map((key) => ({
    name: key,
    value: org.applications[key],
  }));

  const total = chartData.reduce((a, b) => a + b.value, 0);
  const colors = ["#4f46e5", "#22c55e", "#facc15", "#f97316", "#ec4899"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101922] p-6 space-y-8 text-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition"
        >
          <ArrowLeft size={16} /> {t("back")}
        </Button>
        <h1 className="text-2xl font-bold">
          {t("applicationStatisticsFor")}{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {org.organization_name}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 xl:col-span-2">
          <CardContent className="py-4 pr-3 pl-0">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
                {t("applicationStatusDistribution")}
              </h2>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {total}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  tickFormatter={(value) => t(value)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [value, t("applications")]}
                  labelFormatter={(label) => t(label)}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Calendar />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {t("applicationStatusDetails")}
            </h3>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm">
                <tr>
                  <th className="p-3 font-medium">{t("status")}</th>
                  <th className="p-3 font-medium">{t("applications")}</th>
                  <th className="p-3 font-medium">{t("percentage")}</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3">{t(row.name)}</td>
                    <td className="p-3 font-semibold">{row.value}</td>
                    <td className="p-3">
                      {total === 0
                        ? "0%"
                        : `${((row.value / total) * 100).toFixed(1)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {t("applicationBreakdown")}
            </h3>
            <div className="space-y-3">
              {chartData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    ></div>
                    <span>{t(item.name)}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
