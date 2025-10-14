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
    <Card className="bg-white shadow-md border border-gray-100 m-0 p-0">
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-700 mb-4">
          {monthName} {currentYear}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-gray-500 font-medium">
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
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  day === today.getDate()
                    ? "bg-blue-600 text-white font-semibold shadow"
                    : "text-gray-700 hover:bg-gray-100"
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
