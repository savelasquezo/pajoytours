'use client';

import React from "react";
import { SessionProvider } from 'next-auth/react';

import Header from "@/components/header/index";
import Navbar from "@/components/navbar/index";
import Slider from "@/components/slider/index";
import Banner from "@/components/banner/index";
import Advertisement from "@/components/advertisement/index";
import Images from "@/components/images/index";
import WhatsApp from "@/components/whatsapp/index";
import Footer from "@/components/footer/index";


export default function Home() {
  return (
    <SessionProvider >
      <main className='w-full h-full overflow-x-hidden'>
        <Navbar />
        <Header />
        <Slider />
        <Banner />
        <Advertisement />
        <Images />
        <WhatsApp />
        <Footer />
      </main>
    </SessionProvider>
  );
}
