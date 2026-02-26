import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#22223b] px-4 py-4 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
        <p className="text-theme-xs text-white/70">
          &copy; {new Date().getFullYear()} Valor Academy Middle School &mdash; ELD Scaffolding Platform
        </p>
        <Link
          href="/bug-report"
          className="text-theme-xs text-white/50 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
        >
          Report a Bug
        </Link>
      </div>
    </footer>
  );
}
