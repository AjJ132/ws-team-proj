"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import NProgress from "nprogress"; // Change import to default import

export function SignOutItem() {
  const {
    logout
  } = useAuth(); // Get user data from auth context
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={async () => {
        NProgress.start();
        await logout();
        NProgress.done();
      }}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </DropdownMenuItem>
  );
}