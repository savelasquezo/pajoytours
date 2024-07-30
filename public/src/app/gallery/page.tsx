'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Gallery from "@/components/gallery/index";
import Footer from "@/components/footer/index";

const indexGallery: React.FC = () => {
  return (
    <SessionProvider >
      <Suspense fallback={null}>
        <main className='w-full h-full overflow-x-hidden bg-white'>
          <Navbar />
          <Header />
          <Gallery />
          <Footer />
        </main>
      </Suspense>
    </SessionProvider>
  );
};

export default indexGallery;