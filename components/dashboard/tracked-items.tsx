import { createClient } from "@/lib/supabase/server";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import ItemChart from "./item-chart";

interface TrackedItemsProps {
  // No props needed for this component currently
}

const TrackedItems: React.FC<TrackedItemsProps> = async () => {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (!user || error) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <h3>Your tracked items</h3>
          <Separator />
        </CardHeader>
        <CardContent>
          <p>Please log in to view your tracked items.</p>
        </CardContent>
      </Card>
    );
  }

  const { data: trackedItems } = await supabase
    .from("tracking_requests")
    .select("unique_id")
    .eq("user_id", user.user.id);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <h3>Your tracked items</h3>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">
        {trackedItems?.map((item) => (
          <ItemChart key={item.unique_id} unique_id={item.unique_id} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TrackedItems;
