import Navigation from "./Navigation";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Navigation />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            © 2024 VAMS ELD. Empowering English Language Learners.
                        </p>
                        <div className="flex space-x-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Built with Next.js & Tailwind CSS</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;