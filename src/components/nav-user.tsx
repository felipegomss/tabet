"use client";

import { IconDotsVertical, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DollarSign } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";
import { useState } from "react";
import { useTheme } from "next-themes";
import { StakeModal } from "./stake-modal";

export function NavUser({
  user,
  stakeValue,
  userId,
}: {
  user: {
    name: string;
    email: string;
  };
  stakeValue: number | null;
  userId: string;
}) {
  const { isMobile } = useSidebar();
  const [openStake, setOpenStake] = useState(stakeValue == null);
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <IconSun className="mr-2 h-4 w-4" />
                Claro
                {theme === "light" ? (
                  <span className="ml-auto text-xs text-muted-foreground">
                    ativo
                  </span>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <IconMoon className="mr-2 h-4 w-4" />
                Escuro
                {theme === "dark" ? (
                  <span className="ml-auto text-xs text-muted-foreground">
                    ativo
                  </span>
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setOpenStake(true)}>
                <DollarSign className="mr-2 h-4 w-4" />
                Stake
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOutAction} className="w-full">
                <button className="flex w-full items-center">
                  <IconLogout className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Passa controle para o modal */}
      <StakeModal
        defaultValue={stakeValue}
        userId={userId}
        open={openStake}
        onOpenChange={setOpenStake}
      />
    </SidebarMenu>
  );
}
