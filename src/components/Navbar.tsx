
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Home, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/app/calendar', label: 'Calendario', icon: <Calendar className="h-5 w-5" /> },
    { path: '/app/new-encounter', label: 'Nuovo', icon: <Plus className="h-5 w-5" /> },
    { path: '/app/settings', label: 'Impostazioni', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleAvatarClick = () => {
    navigate('/app/settings');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Avatar 
              className="h-8 w-8 cursor-pointer" 
              onClick={handleAvatarClick}
            >
              <AvatarFallback className="bg-relate-500 text-white">U</AvatarFallback>
            </Avatar>
          ) : (
            <NavLink to="/app/dashboard" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-relate-500 text-white font-semibold text-sm">R</div>
              <span className="font-medium tracking-tight text-lg">Relate</span>
            </NavLink>
          )}
        </div>

        {/* Desktop navigation - only show on non-mobile */}
        {!isMobile && (
          <nav className="flex items-center gap-6">
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
        )}
      </div>
    </header>
  );
};

export default Navbar;
