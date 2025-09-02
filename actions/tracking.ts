"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type TrackingItem = Omit<
    Omit<
        Omit<Database["public"]["Tables"]["tracking_requests"]["Row"], "id">,
        "created_at"
    >,
    "user_id"
>;

export async function addTrackingItems(items: TrackingItem[]) {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
        throw new Error("User not authenticated");
    }

    // Remove all existing tracking items for the user
    const { error: deleteError } = await supabase
        .from("tracking_requests")
        .delete()
        .eq("user_id", user.user.id);

    if (deleteError) {
        throw new Error(
            `Failed to remove existing tracking items: ${deleteError.message}`,
        );
    }

    const itemsWithUserId = items.map((item) => ({
        ...item,
        user_id: user.user.id,
    }));

    const { data, error } = await supabase
        .from("tracking_requests")
        .insert(itemsWithUserId);

    if (error) {
        throw new Error(`Failed to add tracking items: ${error.message}`);
    }

    return data;
}

export async function getTrackedItems() {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
        throw new Error("User not authenticated");
    }

    // First get the tracking requests to extract unique_ids and enchantments
    const { data: trackingData, error: trackingError } = await supabase
        .from("tracking_requests")
        .select("unique_id, enchantment")
        .eq("user_id", user.user.id);

    if (trackingError) {
        throw new Error(
            `Failed to get tracking requests: ${trackingError.message}`,
        );
    }

    if (!trackingData || trackingData.length === 0) {
        return [];
    }

    // Get items matching both unique_id and enchantment
    const itemPromises = trackingData.map(async (trackingItem) => {
        const { data: items, error: itemsError } = await supabase
            .from("item")
            .select("*")
            .eq("unique_id", trackingItem.unique_id)
            .eq("enchantment", trackingItem.enchantment);

        if (itemsError) {
            throw new Error(`Failed to get items: ${itemsError.message}`);
        }

        return items || [];
    });

    const results = await Promise.all(itemPromises);
    return results.flat();
}
