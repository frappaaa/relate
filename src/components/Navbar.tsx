
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Home, Plus, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/app/calendar', label: 'Calendario', icon: <Calendar className="h-5 w-5" /> },
    { path: '/app/new-encounter', label: 'Nuovo', icon: <Plus className="h-5 w-5" /> },
    { path: '/app/settings', label: 'Impostazioni', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <NavLink to="/app/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-relate-500 text-white font-semibold text-sm">R</div>
            <span className="font-medium tracking-tight text-lg hidden sm:inline-block">Relate</span>
          </NavLink>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 bg-background border-b md:hidden transition-all duration-300 ease-out-expo transform",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <nav className="container py-4 px-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-primary" : "hover:bg-secondary/50 text-muted-foreground"
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
