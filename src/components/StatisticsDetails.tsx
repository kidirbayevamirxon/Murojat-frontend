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

interface Applications {
  [key: string]: number;
}

interface OrganizationDetail {
  organization_id: number;
  organization_name: string;
  applications: Applications;
}

export default function AdminStatisticsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrganizationDetail | null>(null);

  useEffect(() => {
    axiosInstance.get("/admin/statistics").then((res) => {
      const found = res.data.find(
        (o: OrganizationDetail) => o.organization_id === Number(id)
      );
      setOrg(found);
    });
  }, [id]);

  if (!org)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600 text-lg">
        Loading...
      </div>
    );

  const chartData = Object.keys(org.applications).map((key) => ({
    name: key.replace(/_/g, " "),
    value: org.applications[key],
  }));

  const total = chartData.reduce((a, b) => a + b.value, 0);
  const colors = ["#4f46e5", "#22c55e", "#facc15", "#f97316", "#ec4899"];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Application Statistics for:{" "}
          <span className="text-indigo-600">{org.organization_name}</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md border border-gray-100 xl:col-span-2">
          <CardContent className="py-4 pr-3 pl-0">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-1">
                Application Status Distribution
              </h2>
              <div className="text-4xl font-bold text-indigo-600">{total}</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                  }}
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
        <Card className="bg-white shadow-md border border-gray-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Application Status Details
            </h3>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Applications</th>
                  <th className="p-3 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{row.name}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {row.value}
                    </td>
                    <td className="p-3 text-gray-600">
                      {((row.value / total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md border border-gray-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Floor of Application
            </h3>
            <div className="space-y-3">
              {chartData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
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
