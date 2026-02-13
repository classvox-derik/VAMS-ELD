import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-20 md:pb-6">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
