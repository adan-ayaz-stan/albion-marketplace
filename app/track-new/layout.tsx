import Navigation from "@/components/navigation";
import { Home, Pickaxe } from "lucide-react";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    id: "track-new",
    label: "Track New Item",
    icon: <Pickaxe className="w-5 h-5" />,
    href: "/track-new",
  },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Navigation items={navigationItems} />
    </>
  );
}
