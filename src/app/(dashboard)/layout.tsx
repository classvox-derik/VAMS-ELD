import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-[290px]">
        <Header />
        <main className="p-4 md:p-6 pb-20 lg:pb-6">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
