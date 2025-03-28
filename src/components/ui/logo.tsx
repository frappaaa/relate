
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const bgClasses = {
    default: 'bg-relate-500',
    gradient: 'bg-gradient-relate',
    white: 'bg-white',
  };

  return (
    <div className={cn(
      'flex items-center justify-center rounded-full overflow-hidden', 
      sizeClasses[size],
      bgClasses[variant],
      className
    )}>
      <img 
        src="/lovable-uploads/1f10fa4d-23ce-4766-9f05-7d43ce9b1ae0.png" 
        alt="Relate Logo" 
        className="h-full w-full object-cover"
      />
    </div>
  );
};
