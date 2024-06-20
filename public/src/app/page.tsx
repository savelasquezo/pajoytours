'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Slider from "@/components/slider/index";
import Gallery from "@/components/gallery/index";
import Footer from "@/components/footer/index";

export default function Home() {
  return (
    <SessionProvider >
      <main className='w-full h-full overflow-x-hidden bg-white'>
        <Navbar />
        <Header />
        <Slider />
        <Gallery />
        <Footer />
      </main>
    </SessionProvider>
  );
}
