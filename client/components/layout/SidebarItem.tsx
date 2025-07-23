"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({
  icon,
  label,
  isActive = false,
  onClick,
  className,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex text-accent-foreground items-center gap-2.5 px-2 py-1 rounded text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-accent text-accent-foreground font-semibold"
          : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
        className
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}
