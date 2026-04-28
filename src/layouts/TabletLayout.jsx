import React from 'react';
import { Outlet } from 'react-router-dom';

const TabletLayout = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default TabletLayout;
