import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-[290px]">
        <Header />
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6 lg:border-l lg:border-white/10">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
