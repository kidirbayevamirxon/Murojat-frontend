import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Shield, LucideBuilding2, SettingsIcon, BarChart4 } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function OrganSidebarLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const menu = [
    {
      name: t("applications"),
      icon: <LucideBuilding2 size={22} />,
      path: "/organ",
    },
    {
      name: t("statistics"),
      icon: <BarChart4 size={22} />,
      path: "/organ/statistics",
    },
    {
      name: t("settings"),
      icon: <SettingsIcon size={22} />,
      path: "/organ/settings",
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
        className={`hidden lg:flex w-64 border-r p-4 flex-col transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#101922] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2 px-2 py-3 mb-6 mt-7">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Shield size={20} />
          </div>
          <span className="font-semibold text-lg">{t("organPanel")}</span>
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
        <div className="border-t mt-auto w-full">
          <div className="border-t mt-auto w-full">
            <Button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              variant="destructive"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg mt-4"
            >
              {t("logOut")}
            </Button>
          </div>
        </div>
      </aside>
      <nav
        className={`lg:hidden fixed bottom-0 left-0 w-full flex justify-around py-3 border-t z-50 ${
          theme === "dark"
            ? "bg-[#101922] border-gray-800 text-gray-100"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      >
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs ${
              location.pathname === item.path
                ? "text-blue-600"
                : theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
      <main
        className={`flex-1 p-6 overflow-auto pb-20 lg:pb-6 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#101922] text-gray-100" : "bg-gray-50"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
