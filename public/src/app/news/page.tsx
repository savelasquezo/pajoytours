'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Footer from "@/components/footer/index";

const indexNews: React.FC = () => {
  return (
    <SessionProvider >
      <main className='w-full h-full overflow-x-hidden bg-white'>
        <Navbar />
        <Header />
            <p>Noticias</p>
        <Footer />
      </main>
    </SessionProvider>
  );
};

export default indexNews;