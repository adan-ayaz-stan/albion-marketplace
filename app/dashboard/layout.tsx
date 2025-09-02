import { AuthButton } from "@/components/auth-button";
import Navigation from "@/components/navigation";
import { Home, Pickaxe } from "lucide-react";
import Link from "next/link";

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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Spitfire&apos;s AODP Project</Link>
            </div>
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 w-full flex flex-col max-w-5xl p-5">
          {children}
        </div>
        <Navigation items={navigationItems} />
      </div>
    </main>
  );
}
