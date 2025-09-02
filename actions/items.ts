"use server";

import { createClient } from "@/lib/supabase/server";

export async function getItemsBySearchTerm(
    searchTerm = "",
    page = 1,
    offsetPage = 0,
    perPageItems = 50,
) {
    const supabase = await createClient();
    const { data: items, error } = await supabase
        .from("item")
        .select("*")
        .or(`item_name.ilike.%${searchTerm}%,item_description.ilike.%${searchTerm}%`)
        .range(
            (page - 1 + offsetPage) * perPageItems,
            page * perPageItems + offsetPage * perPageItems - 1,
        );

    if (error) {
        throw new Error(`Failed to fetch items: ${error.message}`);
    }

    return items || [];
}

export async function getItemData(unique_id: string, location?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("item_n_location")
        .select("*")
        .eq("unique_id", unique_id)
        .order("recorded_time", { ascending: false });

    if (location) {
        query = query.eq("location", location);
    }

    const { data: itemData, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch item data: ${error.message}`);
    }

    return itemData || [];
}

export async function getItemDataToday(unique_id: string, location?: string) {
    const supabase = await createClient();

    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    let query = supabase
        .from("item_n_location")
        .select("*")
        .eq("unique_id", unique_id)
        .gte("recorded_time", startOfDay.toISOString())
        .lt("recorded_time", endOfDay.toISOString())
        .order("recorded_time", { ascending: true });

    if (location) {
        query = query.eq("location", location);
    }

    const { data: itemData, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch item data: ${error.message}`);
    }

    // Fill missing hours with 0
    const hourlyData = [];
    const dataMap = new Map();

    // Map existing data by hour
    (itemData || []).forEach((item) => {
        const hour = new Date(item.recorded_time).getHours();
        dataMap.set(hour, item);
    });

    // Fill all 24 hours
    for (let hour = 0; hour < 24; hour++) {
        if (dataMap.has(hour)) {
            hourlyData.push(dataMap.get(hour));
        } else {
            hourlyData.push({
                unique_id,
                location: location || null,
                recorded_time: new Date(
                    startOfDay.getTime() + hour * 60 * 60 * 1000,
                ).toISOString(),
                price: 0,
                count: 0,
                quality: 0,
                created_at: null,
            });
        }
    }

    return hourlyData;
}

// Chart colors can be defined here or passed from the component
const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

// This is the single, powerful function the client will call.
export async function getTodaysChartData(unique_id: string) {
    const supabase = await createClient();

    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6,
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
    );

    // 1. Perform both database queries in parallel for maximum efficiency
    const [itemResult, priceResult] = await Promise.all([
        // Query A: Get the item's name
        supabase
            .from("item")
            .select("item_name")
            .eq("unique_id", unique_id)
            .limit(1) // Get only one record
            .single(), // Coerce the single record result into an object,
        // Query B: Get all of today's price data for this item, across ALL locations
        supabase
            .from("item_n_location")
            .select("location, price, recorded_time")
            .eq("unique_id", unique_id)
            .gte("recorded_time", startOfDay.toISOString())
            .lt("recorded_time", endOfDay.toISOString()),
    ]);

    // Error handling
    if (itemResult.error) {
        throw new Error(
            `Failed to fetch item name: ${itemResult.error.message}`,
        );
    }
    if (priceResult.error) {
        throw new Error(
            `Failed to fetch price data: ${priceResult.error.message}`,
        );
    }

    const itemName = itemResult.data.item_name || unique_id;
    const priceData = priceResult.data;

    // 2. Process all the data on the server
    if (!priceData || priceData.length === 0) {
        // Return a clear structure even if there's no price data
        return { itemName, chartData: [], chartConfig: {} };
    }

    // Determine unique locations from the data we just fetched
    const uniqueLocations = [
        ...new Set(priceData.map((p) => p.location).filter(Boolean)),
    ];

    // Create the chart config and a helper map
    const chartConfig: any = {};
    const locationToSafeKey: { [key: string]: string } = {};
    uniqueLocations.forEach((location, index) => {
        const safeKey = `location${index + 1}`;
        chartConfig[safeKey] = {
            label: location,
            color: CHART_COLORS[index % CHART_COLORS.length],
        };
        locationToSafeKey[location] = safeKey;
    });

    // Initialize the data structure with 24 hours
    const processedData: Array<{ hour: string; [key: string]: any }> = Array
        .from({ length: 24 }, (_, i) => ({
            hour: `${i % 12 === 0 ? 12 : i % 12} ${i < 12 ? "AM" : "PM"}`,
        }));

    // Populate the structure with prices
    priceData.forEach((record) => {
        if (!record.location) return;

        const hour = new Date(record.recorded_time).getHours();
        const safeKey = locationToSafeKey[record.location];

        // Use null for 0 price to create gaps in the chart
        processedData[hour][safeKey] = record.price > 0 ? record.price : null;
    });

    // 3. Return the final, client-ready object
    return {
        itemName,
        chartData: processedData,
        chartConfig,
    };
}

export async function getDrillDownChartDataForLast7Days(unique_id: string) {
    const supabase = await createClient();

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const [itemResult, priceResult] = await Promise.all([
        supabase.from("item").select("item_name").eq("unique_id", unique_id)
            .limit(1).single(),
        supabase.from("item_n_location").select(
            "location, price, recorded_time",
        ).eq("unique_id", unique_id).gte(
            "recorded_time",
            sevenDaysAgo.toISOString(),
        ),
    ]);

    if (itemResult.error && itemResult.error.code !== "PGRST116") {
        throw new Error(
            `Failed to fetch item name: ${itemResult.error.message}`,
        );
    }
    if (priceResult.error) {
        throw new Error(
            `Failed to fetch price data: ${priceResult.error.message}`,
        );
    }

    const itemName = itemResult.data?.item_name || unique_id;
    const priceData = priceResult.data || [];

    if (priceData.length === 0) {
        return {
            itemName,
            dailyAverages: [],
            hourlyDetails: {},
            chartConfig: {},
        };
    }

    const uniqueLocations = [
        ...new Set(priceData.map((p) => p.location).filter(Boolean)),
    ];
    const chartConfig: any = {};
    const locationToSafeKey: { [key: string]: string } = {};
    uniqueLocations.forEach((location, index) => {
        const safeKey = `location${index + 1}`;
        chartConfig[safeKey] = {
            label: location,
            color: CHART_COLORS[index % CHART_COLORS.length],
        };
        locationToSafeKey[location] = safeKey;
    });

    // --- DATA PROCESSING FOR BOTH VIEWS ---
    const dailyAggregates: {
        [date: string]: {
            [location: string]: { total: number; count: number };
        };
    } = {};
    const hourlyDetails: { [date: string]: any[] } = {};

    // 1. Pre-populate hourlyDetails with 24-hour templates for all 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split("T")[0];
        hourlyDetails[dateKey] = Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour % 12 === 0 ? 12 : hour % 12} ${
                hour < 12 ? "AM" : "PM"
            }`,
        }));
    }

    // 2. Process the raw price data
    priceData.forEach((record) => {
        if (!record.location) return;
        const recordDate = new Date(record.recorded_time);
        const dateKey = recordDate.toISOString().split("T")[0];
        const hour = recordDate.getHours();
        const safeKey = locationToSafeKey[record.location];

        // Populate hourly data
        if (hourlyDetails[dateKey] && hourlyDetails[dateKey][hour]) {
            hourlyDetails[dateKey][hour][safeKey] = record.price > 0
                ? record.price
                : null;
        }

        // Aggregate for daily averages
        if (!dailyAggregates[dateKey]) dailyAggregates[dateKey] = {};
        if (!dailyAggregates[dateKey][record.location]) {
            dailyAggregates[dateKey][record.location] = { total: 0, count: 0 };
        }
        dailyAggregates[dateKey][record.location].total += record.price;
        dailyAggregates[dateKey][record.location].count += 1;
    });

    // 3. Finalize the daily average data structure
    const dailyAverages = Object.keys(dailyAggregates).map((date) => {
        const entry: { date: string; [key: string]: any } = { date };
        uniqueLocations.forEach((location) => {
            const safeKey = locationToSafeKey[location];
            const aggregate = dailyAggregates[date][location];
            entry[safeKey] = (aggregate && aggregate.count > 0)
                ? (aggregate.total / aggregate.count)
                : null;
        });
        return entry;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { itemName, dailyAverages, hourlyDetails, chartConfig };
}
