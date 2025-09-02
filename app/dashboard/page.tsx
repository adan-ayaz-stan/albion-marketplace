import TrackedItems from "@/components/dashboard/tracked-items";
import { Button } from "@/components/ui/button";
import { Bell, Hammer, TrendingUp } from "lucide-react";

type QuickActionCard = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const quickActionCards: QuickActionCard[] = [
  {
    label: "Craft & Sell",
    href: "/craft-sell",
    icon: <Hammer className="w-12 h-12" />,
  },
  {
    label: "Market Flipper",
    href: "/market-flipper",
    icon: <TrendingUp className="w-12 h-12" />,
  },
  {
    label: "Market Alerts",
    href: "/market-alerts",
    icon: <Bell className="w-12 h-12" />,
  },
];

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4">
      {/* Three Cards Here */}
      <div className="flex flex-col md:flex-row w-full gap-4 bg-background p-4 rounded-2xl items-center">
        {quickActionCards.map((card, index) => (
          <div
            key={index}
            className="relative w-full dark:border-primary dark:border-2 rounded-full group transition-all duration-300"
          >
            <Button
              variant="ghost"
              className="flex dark:group-hover:text-primary items-center gap-2 p-4 h-auto w-full"
            >
              {card.icon}
              <span className="text-lg font-medium">{card.label}</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Tracked Items Here */}
      <TrackedItems />
    </div>
  );
}
