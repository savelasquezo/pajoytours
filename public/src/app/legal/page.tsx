'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Legal from "@/components/legal/index";
import Footer from "@/components/footer/index";

const indexShedule: React.FC = () => {
  return (
    <SessionProvider >
      <Suspense fallback={null}>
        <main className='w-full h-full overflow-x-hidden bg-white'>
          <Navbar />
          <Header />
          <Legal />
          <Footer />
        </main>
      </Suspense>
    </SessionProvider>
  );
};

export default indexShedule;