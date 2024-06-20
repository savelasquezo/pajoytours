'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Gallery from "@/components/gallery/index";
import Footer from "@/components/footer/index";

const indexShedule: React.FC = () => {
  return (
    <SessionProvider >
      <main className='w-full h-full overflow-x-hidden bg-white'>
        <Navbar />
        <Header />
            <p>Calendario</p>
        <Footer />
      </main>
    </SessionProvider>
  );
};

export default indexShedule;