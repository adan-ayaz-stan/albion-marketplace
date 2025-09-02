"use client";

import { getDrillDownChartDataForLast7Days } from "@/actions/items"; // Import the new action
import { Button } from "@/components/ui/button"; // Import Button for our "Back" button
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface ItemChartProps {
  unique_id: string;
}

// Define more specific types for our data and view state
type ViewState = { type: "daily" } | { type: "hourly"; date: string };
type ChartDataPayload = Awaited<
  ReturnType<typeof getDrillDownChartDataForLast7Days>
>;

// The Y-Axis function is reusable, just needs the dataKey as an argument
const calculateYAxisDomain = (
  chartData: any[],
  dataKey: string
): [number, number] => {
  const maxValue = chartData.reduce((max, row) => {
    const rowMax = Math.max(
      ...Object.keys(row)
        .filter((k) => k !== dataKey)
        .map((k) => Number(row[k]))
        .filter((v) => !isNaN(v)),
      0
    );
    return Math.max(max, rowMax);
  }, 0);
  if (maxValue === 0) return [0, 1000];
  const exponent = Math.floor(Math.log10(maxValue));
  const powerOf10 = Math.pow(10, exponent);
  const normalized = maxValue / powerOf10;
  const niceNormalizedCeiling =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return [0, niceNormalizedCeiling * powerOf10];
};

const ItemChart: React.FC<ItemChartProps> = ({ unique_id }) => {
  const [data, setData] = useState<ChartDataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- NEW: State to manage the current view ---
  const [view, setView] = useState<ViewState>({ type: "daily" });

  useEffect(() => {
    const fetchData = async () => {
      if (!unique_id) return;
      try {
        setLoading(true);
        setError(null);
        const result = await getDrillDownChartDataForLast7Days(unique_id);
        setData(result);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load chart data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unique_id]);

  // Memoize the chart data and domain to prevent recalculations on re-render
  const { chartData, yAxisDomain, title, description } = useMemo(() => {
    if (!data)
      return {
        chartData: [],
        yAxisDomain: [0, 1000],
        title: "",
        description: "",
      };

    if (view.type === "hourly") {
      const hourlyData = data.hourlyDetails[view.date] || [];
      const formattedDate = new Date(view.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      return {
        chartData: hourlyData,
        yAxisDomain: calculateYAxisDomain(hourlyData, "hour"),
        title: `${data.itemName} - Hourly Prices`,
        description: `Price breakdown for ${formattedDate}`,
      };
    }

    // Default to daily view
    return {
      chartData: data.dailyAverages,
      yAxisDomain: calculateYAxisDomain(data.dailyAverages, "date"),
      title: `${data.itemName} - Daily Price Trends`,
      description: `Average daily price for the last 7 days. Click a point to see hourly details.`,
    };
  }, [data, view]);

  // The loading and error states are essentially the same
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Price History</CardTitle>
          <CardDescription>Loading today's price data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load chart data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Handle the "no data" case
  if (!data || data.dailyAverages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Price History</CardTitle>
          <CardDescription>{data?.itemName || unique_id}</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">
            No price data available for this item today.
          </p>
        </CardContent>
      </Card>
    );
  }
  const handleChartClick = (event: any) => {
    // Only drill down if we are in the daily view
    if (
      view.type === "daily" &&
      event &&
      event.activePayload &&
      event.activePayload.length > 0
    ) {
      const clickedDate = event.activePayload[0].payload.date;
      setView({ type: "hourly", date: clickedDate });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {view.type === "hourly" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView({ type: "daily" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={data.chartConfig}
          className="min-h-[400px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            onClick={handleChartClick}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={view.type === "daily" ? "date" : "hour"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (view.type === "daily") {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  });
                }
                return value; // 'hour' is already formatted
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => Number(value).toLocaleString()}
              domain={yAxisDomain}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    if (view.type === "daily") {
                      return new Date(label).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      });
                    }
                    return label; // The hour is the label
                  }}
                  formatter={(value, name) => [
                    `${Math.round(Number(value)).toLocaleString()} silver ${
                      view.type === "daily" ? "(avg)" : ""
                    }`,
                    data.chartConfig[name]?.label || name,
                  ]}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(data.chartConfig).map((safeKey) => (
              <Line
                key={safeKey}
                type="monotone"
                dataKey={safeKey}
                stroke={`var(--color-${safeKey})`}
                strokeWidth={2}
                dot={view.type === "daily"} // Show dots on daily, hide on dense hourly
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ItemChart;
