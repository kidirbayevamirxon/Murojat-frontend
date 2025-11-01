import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([
    "Y",
    "D",
    "S",
    "Ch",
    "P",
    "J",
    "Sh",
  ]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const monthName = today.toLocaleString(i18n.language, { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    try {
      const daysString = t("daysOfWeek");
      if (daysString && daysString.startsWith("[")) {
        const parsedDays = JSON.parse(daysString);
        if (Array.isArray(parsedDays)) setDaysOfWeek(parsedDays);
      }
    } catch (error) {
      console.error("Error parsing daysOfWeek:", error);
      const lang = i18n.language;
      if (lang === "ru") setDaysOfWeek(["В", "П", "В", "С", "Ч", "П", "С"]);
      else if (lang === "kaa")
        setDaysOfWeek(["Ж", "Д", "С", "С", "Б", "Ж", "С"]);
      else setDaysOfWeek(["Y", "D", "S", "Ch", "P", "J", "Sh"]);
    }
  }, [t, i18n.language]);

  const emptyCells = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCells = [...emptyCells, ...days];

  return (
    <Card
      className="
        bg-white border border-gray-200 text-gray-900
        dark:bg-[#101922] dark:border-gray-800 dark:text-white
        shadow-lg rounded-2xl transition-colors duration-300
      "
    >
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200 capitalize">
          {monthName} {currentYear}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {daysOfWeek.map((d, i) => (
            <div
              key={i}
              className="text-gray-500 dark:text-gray-400 font-medium uppercase"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {allCells.map((day, i) =>
            day === null ? (
              <div key={`empty-${i}`} />
            ) : (
              <div
                key={`day-${day}-${i}`}
                className={`
                  p-2 rounded-md cursor-pointer transition-all duration-200
                  ${
                    day === today.getDate()
                      ? "bg-blue-600 text-white font-semibold shadow-md scale-105"
                      : `
                          text-gray-700 dark:text-gray-300
                          hover:bg-blue-100 dark:hover:bg-blue-900/40
                          hover:text-blue-600 dark:hover:text-white
                        `
                  }
                `}
              >
                {day}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
