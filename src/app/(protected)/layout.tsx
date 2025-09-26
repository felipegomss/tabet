import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { type CSSProperties, type ReactNode } from "react";

const sidebarStyles: CSSProperties &
  Record<"--sidebar-width" | "--header-height", string> = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
};

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let stakeValue: number | null = null;

  if (user) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("stake_value")
      .eq("user_id", user.id)
      .single();

    stakeValue = settings?.stake_value ?? null;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider style={sidebarStyles}>
      <AppSidebar
        variant="inset"
        defaultStakeValue={stakeValue}
        user={{
          name: user.user_metadata.name,
          email: user.email ?? "",
        }}
        userId={user?.id}
      />
      <SidebarInset>
        <SiteHeader userId={user?.id ?? ""} stakeValue={stakeValue ?? 50} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
