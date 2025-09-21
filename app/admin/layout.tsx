import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar user={user} />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header với SidebarTrigger */}
          <header className="flex items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger />
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
