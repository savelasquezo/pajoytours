import React, { useState, useEffect } from 'react';
import { getSettings } from '@/utils/getSettings';
import Image from 'next/image';
import { imageLoader } from '@/utils/imageConfig';

const Banner: React.FC = () => {
  const [settings, setSettings] = useState<{ [key: string]: any } | null>(null);
  useEffect(() => {
    const fetchedSettings = getSettings();
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, []);

  return (
    <section className="relative flex flex-col items-start justify-start h-72 md:h-[28vh] lg:h-[44vh] w-screen py-8 px-12 mt-12 mb-24 md:mb-44">
      <div className="absolute top-0 left-0 h-full w-full bg-background-image01 bg-cover opacity-40 mask-image"></div>
      <div className="flex flex-row items-center justify-center -ml-6 md:ml-0">
        <img src="assets/images/icon00.png" className="h-24 lg:h-52" alt="PJ" />
        <span className="text-4xl lg:text-7xl font-poppins whitespace-nowrap text-gray-700 z-20">PajoyTours</span>
      </div>
      <p className='w-full md:w-1/2 lg:w-2/5 text-sm lg:text-2xl text-center font-comicsanseu md:text-justify leading-none z-20'>Explora el corazón del café colombiano, donde la tradición y la naturaleza se unen para ofrecerte una experiencia única.</p>
      <a href="/gallery?type=all" className="absolute bottom-10 left-8 lg:left-12 w-10/12 text-center md:w-96 lg:w-[50rem] h-10  bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300 z-20">
        Ir al Catalogo
      </a>
      {settings ? (
        <div className="hidden md:block md:absolute top-6 lg:top-12 right-8 lg:right-16">
          <Image width={1200} height={900} src={settings?.image1} loader={imageLoader} priority={true} className="h-64 lg:h-[32rem] w-64 lg:w-[48rem] bg-cover" alt=""/>
        </div>
      ) : null}
    </section>
  );
};

export default Banner;
