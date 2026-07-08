import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Container from '../components/Container.jsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
export { MainLayout };
