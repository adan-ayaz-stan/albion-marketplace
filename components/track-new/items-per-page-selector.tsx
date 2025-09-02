import { useTracking } from "@/contexts/TrackingContext";
import React from "react";

interface ItemsPerPageSelectorProps {
  className?: string;
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
  className = "",
}) => {
  const { paginationInfo, setItemsPerPage, isLoading } = useTracking();

  const handleItemsPerPageChange = async (newItemsPerPage: number) => {
    await setItemsPerPage(newItemsPerPage);
  };

  if (paginationInfo.totalItems === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span>Items per page:</span>
      <select
        value={paginationInfo.itemsPerPage}
        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
        disabled={isLoading}
        className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default ItemsPerPageSelector;
