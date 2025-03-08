
import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} Artisan Coffee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
