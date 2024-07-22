import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { SessionInfo } from '@/lib/types/types';

import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";

import { getSettings } from '@/utils/getSettings';

const Navbar: React.FC<SessionInfo> = ({ session }) => {
  const [settings, setSettings] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    const fetchedSettings = getSettings();
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, []);

  return (
    <div className='h-12 bg-pajoy1 flex flex-row justify-between items-center px-4'>
      <div className='w-1/2 flex flex-row justify-center items-center gap-x-4 text-lg text-gray-50'>
        <Link href={`https://wa.me/${settings?.phone}`} target="_blank" rel="noopener noreferrer">
          <button className='bg-whatsapp-default hover:bg-whatsapp-hover shadow-inner p-1 rounded-full transition duration-300'><FaWhatsapp /></button>
        </Link>
        <Link href={`${settings?.facebook}`} target="_blank" rel="noopener noreferrer">
          <button className='bg-facebook-default hover:bg-facebook-hover shadow-inner p-1 rounded-full transition duration-300'><FaFacebookF /></button>
        </Link>
        <Link href={`${settings?.instagram}`} target="_blank" rel="noopener noreferrer">
          <button className='bg-instagram-default hover:bg-instagram-hover shadow-inner p-1 rounded-full transition duration-300'><FaInstagram /></button>
        </Link>
        <p className='flex flex-row items-center justify-center gap-x-4 border-l border-white pl-4 text-sm'>
          <span>NIT</span><span>{settings?.nit}</span>
        </p>
      </div>
      <div className='w-1/2 flex flex-row justify-center items-center text-gray-100 gap-x-4'>
        <a href="#" className="transition hover:text-white"> {settings?.email}</a>
        <div className='flex flex-row items-center justify-center gap-x-4 border-l border-white pl-4'>
          <FaPhoneVolume />
          <span className='text-sm'>{settings?.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
