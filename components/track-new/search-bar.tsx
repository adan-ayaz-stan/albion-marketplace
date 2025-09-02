import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTracking } from "@/contexts/TrackingContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

// Define the form schema
const formSchema = z.object({
  tier: z.array(z.number()),
  searchQuery: z.string(),
});

const SearchBar: React.FC = () => {
  const { performSearch, isLoading } = useTracking();

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tier: [],
      searchQuery: "",
    },
  });

  // Define submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission using context - always start from page 1 for new search
    console.log("Form submitted with values:", values);
    await performSearch(values, 1);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Search Query Field */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search for items..."
                      {...field}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      variant={"ghost"}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      ) : (
                        <Search />
                      )}
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tier Toggle Group */}
          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormLabel>Tier</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      value={field.value.map(String)}
                      onValueChange={(values) =>
                        field.onChange(values.map(Number))
                      }
                      className="justify-start"
                      disabled={isLoading}
                    >
                      <ToggleGroupItem
                        value="1"
                        className="px-4 w-fit"
                        aria-label="T1"
                      >
                        T1
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="2"
                        aria-label="T2"
                        className="px-4 w-fit"
                      >
                        T2
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="3"
                        aria-label="T3"
                        className="px-4 w-fit"
                      >
                        T3
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="4"
                        className="px-4 w-fit"
                        aria-label="T4"
                      >
                        T4
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="5"
                        className="px-4 w-fit"
                        aria-label="T5"
                      >
                        T5
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="6"
                        className="px-4 w-fit"
                        aria-label="T6"
                      >
                        T6
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="7"
                        className="px-4 w-fit"
                        aria-label="T7"
                      >
                        T7
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="8"
                        className="px-4 w-fit"
                        aria-label="T8"
                      >
                        T8
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default SearchBar;
