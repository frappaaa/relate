
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

type MobileTabItemProps = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

export const MobileTabItem: React.FC<MobileTabItemProps> = ({ path, label, icon }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-full h-full px-1",
          "text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )
      }
    >
      <div className="mb-1">{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
};
