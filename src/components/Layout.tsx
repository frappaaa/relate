
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
