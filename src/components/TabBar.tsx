
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const TabBar: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/app/calendar', label: 'Calendario', icon: <Calendar className="h-5 w-5" /> },
    { path: '/app/new-encounter', label: 'Nuovo', icon: <Plus className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full px-1",
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <div className="mb-1">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default TabBar;
