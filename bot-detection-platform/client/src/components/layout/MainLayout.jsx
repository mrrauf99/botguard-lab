import { Outlet } from 'react-router-dom';
import { memo } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default memo(MainLayout);
