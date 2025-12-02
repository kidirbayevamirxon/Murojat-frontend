import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Applications {
  [key: string]: number;
}

interface OrganizationDetail {
  organization_id: number;
  applications: Applications;
}

export default function OrganStatistics() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrganizationDetail | null>(null);

  const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchOrgStats = async () => {
      try {
        const res = await axiosInstance.get("/organ/statistics");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setOrg(res.data[0]);
        } else {
          toast.error("Ma'lumot topilmadi");
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Sessiya tugadi. Qayta tizimga kiring.");
          navigate("/login");
        } else {
          toast.error("Xatolik yuz berdi");
        }
      }
    };

    fetchOrgStats();
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#101922] p-4 sm:p-0 space-y-6 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          {t("applicationStatisticsFor")}{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            ID: {org.organization_id}
          </span>
        </h1>
      </div>

      <div className="xl:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 xl:col-span-2">
          <CardContent className="py-4 pr-3 pl-1 sm:pl-3">
            <div className="text-center mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
                {t("applicationStatusDistribution")}
              </h2>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {total}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barGap={10}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#aaa", fontSize: 11 }}
                  tickFormatter={(value) => t(value)}
                />
                <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const labelStr = label?.toString() || "";
                      return (
                        <div
                          style={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        >
                          <div
                            style={{ marginBottom: "4px", fontWeight: "bold" }}
                          >
                            {t(labelStr)}
                          </div>
                          <div className="gap-2 flex">
                            <span style={{ color: "white" }}>
                              {t("applications")}:
                            </span>
                            {payload[0].value}{" "}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-lg">
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
                    <span className="text-sm sm:text-base">{t(item.name)}</span>
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
