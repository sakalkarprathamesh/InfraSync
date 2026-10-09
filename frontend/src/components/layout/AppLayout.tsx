import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoomieHeader } from './RoomieHeader';
import { RoomieFooter } from './RoomieFooter';
import { RoomieMobileNav } from './RoomieMobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#202124]">
      <RoomieHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        <Outlet />
      </main>
      <RoomieFooter />
      <RoomieMobileNav />
    </div>
  );
};

