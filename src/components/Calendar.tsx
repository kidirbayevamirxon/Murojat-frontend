import { Card, CardContent } from "@/components/ui/card";

export default function Calendar() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const emptyCells = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCells = [...emptyCells, ...days];

  return (
    <Card className="bg-[#101922] border border-gray-800 shadow-lg text-white rounded-2xl">
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-4 text-gray-200">
          {monthName} {currentYear}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-gray-400 font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {allCells.map((day, i) =>
            day === null ? (
              <div key={i} />
            ) : (
              <div
                key={day}
                className={`p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  day === today.getDate()
                    ? "bg-blue-600 text-white font-semibold shadow-md scale-105"
                    : "text-gray-300 hover:bg-blue-900/40 hover:text-white"
                }`}
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
