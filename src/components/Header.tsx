
import React from "react";
import { Coffee } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 bg-background border-b border-border animate-slide-down">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">Artisan Coffee</h1>
            <p className="text-sm text-muted-foreground">Coffee Shop Manager</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Manage Shops</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Analytics</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
