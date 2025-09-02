import { useTracking, type Item } from "@/contexts/TrackingContext";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface TrackedItemCardProps extends Item {}

const TrackedItemCard: React.FC<TrackedItemCardProps> = ({
  unique_id,
  item_name,
  item_description,
  enchantment,
  tier,
}) => {
  const { removeTrackedItem } = useTracking();

  const handleRemove = () => {
    removeTrackedItem(unique_id);
  };

  return (
    <div className="bg-white w-full rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-gray-800 truncate pr-2">
          {item_name}
        </h4>
        <div className="flex gap-1 items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded">
            T{tier}
          </span>
          {enchantment > 0 && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-1.5 py-0.5 rounded">
              +{enchantment}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0 ml-1"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
        {item_description}
      </p>

      <div className="text-xs text-gray-400 font-mono truncate">
        {unique_id}
      </div>
    </div>
  );
};

export default TrackedItemCard;
