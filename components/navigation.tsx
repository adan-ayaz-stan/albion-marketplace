"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  onItemClick,
}) => {

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/80 dark:bg-background backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-2">
          {items.map((item) => (
            <Link href={item.href} key={item.id}>
              <Button onClick={() => onItemClick?.(item.id)} variant={"ghost"}>
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium hidden sm:inline">
                  {item.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
