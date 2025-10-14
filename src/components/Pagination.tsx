import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
      <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md shadow-sm">
        Showing{" "}
        <span className="font-semibold text-gray-800">{filteredItems}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalItems}</span>{" "}
        organizations
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 
                     shadow-sm transition-all duration-200"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((p, index) =>
            p === "..." ? (
              <span key={index} className="text-gray-400 px-2">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className={`rounded-md w-8 h-8 font-medium transition-all duration-200 ${
                  p === currentPage
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-sm"
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
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 
                     shadow-sm transition-all duration-200"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      <div className="flex w-[23%]"></div>
    </div>
  );
}
