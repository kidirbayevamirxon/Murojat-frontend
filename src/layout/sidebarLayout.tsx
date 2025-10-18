import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Building2,
  Grid2X2,
  BarChart4,
  SettingsIcon,
} from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function SidebarLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const menu = [
    { name: t("organizations"), icon: <Building2 size={18} />, path: "/" },
    {
      name: t("applications"),
      icon: <Grid2X2 size={18} />,
      path: "/applications",
    },
    {
      name: t("statistics"),
      icon: <BarChart4 size={18} />,
      path: "/statistics",
    },
    {
      name: t("settings"),
      icon: <SettingsIcon size={18} />,
      path: "/settings",
    },
  ];

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#101922] text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <aside
        className={`w-64 border-r p-4 flex flex-col transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#101922] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2 px-2 py-3 mb-6 mt-7">
          <div
            className={`p-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            <Shield size={20} />
          </div>
          <span className="font-semibold text-lg">{t("adminPanel")}</span>
        </div>
        <nav className="flex flex-col space-y-1">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="border-t-2 mt-[63vh] w-full">
          <Button
            onClick={() => {
              navigate("/login");
            }}
            variant="destructive"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg mt-4"
          >
            {t("logOut")}
          </Button>
        </div>
      </aside>
      <main
        className={`flex-1 p-6 overflow-auto transition-colors duration-300 ${
          theme === "dark" ? "bg-[#101922] text-gray-100" : "bg-gray-50"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
