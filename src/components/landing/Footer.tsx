
import React from 'react';
import { Logo } from '@/components/ui/logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t">
      <div className="container px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Logo variant="gradient" size="sm" />
          <span className="text-sm font-medium">Relate</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Relate. Tutti i diritti riservati. v1.0
        </p>
      </div>
    </footer>
  );
};

export default Footer;
