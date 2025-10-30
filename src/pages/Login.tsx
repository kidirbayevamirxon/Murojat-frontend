import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import { axiosInstance } from "../api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t("fill_all_fields"));
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/login", {
        login: username,
        password: password,
      });
      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);
      toast.success(t("login_success"));
      const role = res.data.role;
      if (role === "admin") {
        window.location.href = "/";
      } else if (role === "organ") {
        window.location.href = "/organ";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f7f8] dark:bg-[#101922] transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1a2533] rounded-2xl shadow-md p-10 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CloudUpload
              className="h-12 w-12 text-blue-600 dark:text-blue-400"
              strokeWidth={2}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("welcome_back")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("signin_to_account")}
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                name="username"
                placeholder={t("username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-t-md border border-gray-300 dark:border-gray-600 px-3 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm transition-colors"
              />
              <input
                type="password"
                name="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-b-md border border-gray-300 dark:border-gray-600 px-3 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2">{t("remember_me")}</span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              {t("forgot_password")}
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors"
          >
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
