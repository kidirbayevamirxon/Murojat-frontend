import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  filteredItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  filteredItems,
}: PaginationProps) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setTheme("dark");
  }, []);

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const isDark = theme === "dark";

  return (
    <div
      className={`flex justify-between items-center mt-6 flex-wrap gap-3 ${
        isDark ? "text-gray-300" : "text-gray-700"
      }`}
    >
      <div
        className={`text-sm px-4 py-2 rounded-md shadow-sm ${
          isDark
            ? "bg-[#1E293B] text-gray-300 border border-gray-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {t("showingResults", {
          filtered: filteredItems,
          total: totalItems,
        })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`px-4 py-2 rounded-md border transition-all duration-200 ${
            isDark
              ? "bg-[#101922] text-gray-200 border-gray-700 hover:bg-blue-900 hover:text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700"
          }`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {t("previous")}
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((p, index) =>
            p === "..." ? (
              <span key={index} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className={`rounded-md w-8 h-8 font-medium transition-all duration-200 ${
                  p === currentPage
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : isDark
                    ? "bg-[#101922] text-gray-200 border-gray-700 hover:bg-blue-900 hover:text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => onPageChange(Number(p))}
              >
                {p}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className={`px-4 py-2 rounded-md border transition-all duration-200 ${
            isDark
              ? "bg-[#101922] text-gray-200 border-gray-700 hover:bg-blue-900 hover:text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t("next")}
        </Button>
      </div>
      <div className="flex w-[23%]" />
    </div>
  );
}
