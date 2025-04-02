
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { UserAvatar } from './UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Heart, Beaker } from 'lucide-react';

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

type DesktopNavigationProps = {
  navItems: NavItem[];
  profileData: {
    first_name: string | null;
    avatar_url: string | null;
  } | null;
  email?: string | null;
  onAvatarClick: () => void;
  onNewTest: () => void;
  onNewEncounter: () => void;
};

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  profileData,
  email,
  onAvatarClick,
  onNewTest,
  onNewEncounter
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex">
          <NavLink to="/app/dashboard" className="flex items-center space-x-2">
            <Logo />
            <span className="font-bold text-lg">Relate</span>
          </NavLink>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4 lg:space-x-6 mr-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1 text-muted-foreground">
                <Plus className="h-5 w-5" />
                <span>Nuovo</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                <DropdownMenuItem onClick={onNewEncounter} className="cursor-pointer">
                  <Heart className="h-4 w-4 mr-2 text-relate-500" />
                  <span>Nuovo rapporto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onNewTest} className="cursor-pointer">
                  <Beaker className="h-4 w-4 mr-2 text-primary" />
                  <span>Nuovo test</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <UserAvatar 
            firstName={profileData?.first_name}
            email={email}
            avatarUrl={profileData?.avatar_url}
            onClick={onAvatarClick}
          />
        </div>
      </div>
    </header>
  );
};
