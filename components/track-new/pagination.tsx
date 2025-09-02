import { Button } from "@/components/ui/button";
import { useTracking } from "@/contexts/TrackingContext";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import React from "react";

interface PaginationProps {
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ className = "" }) => {
  const { paginationInfo, nextPage, previousPage, goToPage, isLoading } =
    useTracking();

  if (paginationInfo.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, totalItems, itemsPerPage } = paginationInfo;

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-600 text-center">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={!paginationInfo.hasPreviousPage || isLoading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === "..." ? (
                <span className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNumber as number)}
                  disabled={isLoading}
                  className="min-w-[2.5rem]"
                >
                  {pageNumber}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!paginationInfo.hasNextPage || isLoading}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick page jump for large datasets */}
      {totalPages > 10 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>Go to page:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }}
            disabled={isLoading}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
