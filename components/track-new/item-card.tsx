import { useTracking, type Item } from "@/contexts/TrackingContext";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ItemCardProps extends Item {}

const ItemCard: React.FC<ItemCardProps> = ({
  unique_id,
  item_name,
  item_description,
  enchantment,
  tier,
}) => {
  const { addTrackedItem, trackedItems } = useTracking();

  const isAlreadyTracked = trackedItems.some(
    (item) => item.unique_id === unique_id
  );

  const handleAddToTrack = () => {
    if (!isAlreadyTracked) {
      addTrackedItem({
        unique_id,
        item_name,
        item_description,
        enchantment,
        tier,
      });
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {item_name}
        </h3>
        <div className="flex gap-2 ml-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            T{tier}
          </span>
          {enchantment > 0 && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-0.5">
              {Array.from({ length: enchantment }, (_, i) => (
                <span key={i} className="text-yellow-500">
                  ✦
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {item_description}
      </p>
      <div className="flex items-center justify-end">
        <Button
          variant={isAlreadyTracked ? "outline" : "secondary"}
          onClick={handleAddToTrack}
          disabled={isAlreadyTracked}
        >
          <Plus />
          {isAlreadyTracked ? "Already Tracked" : "Add To Track"}
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;
