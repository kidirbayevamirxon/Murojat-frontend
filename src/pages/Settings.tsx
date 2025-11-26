import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const handleLangChange = (lang: "uz" | "ru" | "kaa") => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (mode: string) => {
    setTheme(mode as "light" | "dark");
    localStorage.setItem("theme", mode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#101922] font-display text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* <header className="bg-white dark:bg-[#101922]/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("Admin Panel")}
              </h1>
            </div>
          </div>
        </div>
      </header> */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t("settings.title") || "Settings"}
            </h2>
          </div>
          <section>
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t("settings.appearance") || "Appearance"}
            </h3>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <div className="flex items-center justify-between py-6">
                <div>
                  <h4 className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {t("settings.theme") || "Interface Theme"}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("settings.theme_desc") ||
                      "Select your preferred interface style."}
                  </p>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`w-12 h-10 flex items-center justify-center rounded-full transition ${
                      theme === "light"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`w-12 h-10 flex items-center justify-center rounded-full transition ${
                      theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t("settings.localization") || "Localization"}
            </h3>
            <div className="py-2">
              <label
                htmlFor="language"
                className="block text-base font-medium text-slate-800 dark:text-slate-200 mb-2"
              >
                {t("settings.language") || "Language"}
              </label>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {t("settings.language_desc") ||
                  "Choose the language for the application interface."}
              </p>
              <div className="p-6 rounded-xl bg-slate-100 dark:bg-[#192434] transition-colors duration-300">
                <h1 className="text-2xl font-semibold mb-4">{t("settings")}</h1>
                <div className="flex flex-col gap-4">
                  <label className="text-gray-700 dark:text-gray-300">
                    {t("choose_language")}
                  </label>
                  <Select
                    value={i18n.language}
                    onValueChange={handleLangChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={t("select_language")}
                        defaultValue={i18n.language}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">O‘zbekcha</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="kaa">Qaraqalpaqsha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="w-full mb-6">
              <Button
                onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              variant="destructive"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg"
              >
                {t("logOut")}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
