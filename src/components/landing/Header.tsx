
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Logo variant="gradient" size="md" />
          <span className="font-medium tracking-tight text-xl">Relate</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild className="shadow-sm">
            <Link to="/login">Accedi</Link>
          </Button>
          <Button size="sm" className="bg-gradient-relate shadow-sm" asChild>
            <Link to="/register">Registrati</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
