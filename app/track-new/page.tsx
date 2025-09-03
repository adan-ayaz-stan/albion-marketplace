"use client";

import { getItemsBySearchTerm } from "@/actions/items";
import { addTrackingItems, getTrackedItems } from "@/actions/tracking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  DeleteIcon,
  Loader2,
  PlusCircleIcon,
  Save,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  searchTerm: z
    .string()
    .min(3, {
      message: "Please type in at least 3 characters.",
    })
    .max(50),
});

// Define the item type outside the component to prevent re-declaration on re-renders
type ItemType = {
  created_at: string | null;
  enchantment: number;
  item_description: string | null;
  item_name: string;
  tier: number;
  unique_id: string;
  updated_at: string | null;
};

export default function TrackNewPage() {
  const [page] = useState<number>(1);
  const [itemsToTrack, setItemsToTrack] = useState<ItemType[]>([]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  // Auto-submit with debounce when form is valid
  const { watch } = form;
  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchMutation = useMutation({
    mutationKey: ["search-items"],
    mutationFn: (values: z.infer<typeof formSchema>) =>
      getItemsBySearchTerm(values.searchTerm, page, 0, 50),
  });

  // Simple submit handler for manual form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    searchMutation.mutate(values);
  };

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      searchMutation.mutate({ searchTerm: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm]);

  // Expose mutation data and state
  const { data: searchResults, isPending } = searchMutation;

  // Handlers for adding and removing items to track
  const addItemToTrack = (item: ItemType) => {
    if (itemsToTrack.length >= 5) {
      toast.error("You can only track up to 5 items at a time");
      return;
    }
    setItemsToTrack((prev) => [...prev, item]);
  };

  const removeItemFromTrack = (itemKey: string) => {
    setItemsToTrack((prev) =>
      prev.filter(
        (item) =>
          `${item.unique_id}-${item.tier}-${item.enchantment}` !== itemKey
      )
    );
  };

  const isItemTracked = (item: ItemType) => {
    return itemsToTrack.some(
      (trackedItem) =>
        `${trackedItem.unique_id}-${trackedItem.tier}-${trackedItem.enchantment}` ===
        `${item.unique_id}-${item.tier}-${item.enchantment}`
    );
  };

  const trackItemsMutation = useMutation({
    mutationKey: ["item", "tracking"],
    mutationFn: (items: ItemType[]) => {
      const map = items.map((ele) => {
        return {
          unique_id: ele.unique_id,
          enchantment: ele.enchantment,
        };
      });
      return addTrackingItems(map);
    },
    onSuccess: () => {
      toast.success("Items saved successfully!");
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast.error("Failed to save items. Please try again.");
      console.error("Error saving tracking items:", error);
    },
  });

  useEffect(() => {
    const fetchTrackedItems = async () => {
      try {
        const trackedItems = await getTrackedItems();
        setItemsToTrack(trackedItems || []);
      } catch (error) {
        console.error("Error fetching tracked items:", error);
        toast.error("Failed to load tracked items");
      }
    };

    fetchTrackedItems();
  }, []);

  return (
    <div className="md:min-h-screen grid">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col-reverse md:flex-row"
        >
          {/* Left side - To show items to track */}
          <div className="border-r-2 border-primary w-full p-4 md:px-8">
            <div className="h-full p-4 w-full border-primary border-2 rounded-xl shadow-primary shadow-lg bg-gradient-to-br dark:from-zinc-950 dark:to-gray-950">
              <div className="flex items-start justify-between gap-4">
                <FormField
                  control={form.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Search your items here.."
                          {...field}
                        />
                      </FormControl>
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          form.getFieldState("searchTerm").error
                            ? "max-h-6"
                            : "max-h-0"
                        }`}
                      >
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button disabled={isPending}>
                  {isPending ? <Loader2 /> : <Search />}{" "}
                  {isPending ? "Searching..." : "Search"}
                </Button>
              </div>
              <Separator className="my-2" />

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {searchResults?.length
                  ? searchResults.length > 0 &&
                    searchResults.map((ele: ItemType) => {
                      return (
                        <Card
                          key={ele.unique_id + ele.tier + ele.enchantment}
                          className="w-full flex items-center justify-between max-w-96 border p-4 bg-zinc-950 rounded-xl"
                        >
                          <div className="flex flex-col">
                            <p className="text-lg">{ele.item_name}</p>
                            <p className="text-sm">{ele.item_description}</p>
                            <Badge className="mt-2 w-fit">
                              Enchatment: {ele.enchantment}
                            </Badge>
                          </div>
                          {isItemTracked(ele) ? (
                            <Button
                              className="p-2"
                              size={"icon"}
                              variant="destructive"
                              type="button"
                              onClick={() =>
                                removeItemFromTrack(
                                  `${ele.unique_id}-${ele.tier}-${ele.enchantment}`
                                )
                              }
                            >
                              <DeleteIcon />
                            </Button>
                          ) : (
                            <Button
                              className="p-2"
                              size={"icon"}
                              type="button"
                              onClick={() => addItemToTrack(ele)}
                            >
                              <PlusCircleIcon />
                            </Button>
                          )}
                        </Card>
                      );
                    })
                  : ""}

                {searchResults?.length === 0 &&
                  !isPending &&
                  debouncedSearchTerm.length >= 3 && (
                    <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-muted/50 rounded-full p-6 mb-4">
                        <Search className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No items found
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        We couldn&apos;t find any items matching &quot;
                        {debouncedSearchTerm}&quot;. Try using different
                        keywords or check your spelling.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* Right side - To show items you are tracking */}
          <div className="w-full max-w-[40rem]">
            <div className="sticky top-0 right-0 p-4 md:px-8">
              <div className="flex flex-col gap-4 bg-gradient-to-br dark:from-zinc-950 dark:to-gray-950 p-4 rounded-2xl border-2 border-primary shadow-md shadow-primary">
                <h4 className="font-semibold">Items you&apos;re tracking</h4>
                <Separator />

                <div className="flex flex-col gap-4">
                  {itemsToTrack.length > 0 ? (
                    itemsToTrack.map((item) => {
                      const itemKey = `${item.unique_id}-${item.tier}-${item.enchantment}`;
                      return (
                        <Card
                          key={itemKey}
                          className="p-4 flex items-center justify-between bg-background rounded-xl"
                        >
                          <div>
                            <p className="text-lg font-semibold">
                              {item.item_name}
                            </p>
                            <span className="text-sm block">
                              {item.item_description}
                            </span>
                            <Badge className="mt-1 w-fit text-xs">
                              Enchantment: {item.enchantment}
                            </Badge>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => removeItemFromTrack(itemKey)}
                          >
                            <DeleteIcon /> Delete
                          </Button>
                        </Card>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No items being tracked yet. Add items from the search
                      results.
                    </p>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Save your tracking items to take effect.
                  </span>
                  <Button
                    onClick={() => trackItemsMutation.mutate(itemsToTrack)}
                    disabled={
                      trackItemsMutation.isPending || itemsToTrack.length === 0
                    }
                  >
                    {trackItemsMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save /> Save Tracking Items
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
