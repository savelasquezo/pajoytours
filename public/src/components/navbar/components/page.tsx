import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { SessionInfo, InfoType } from '@/lib/types/types';

import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";



export const fetchInfo = async () => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/core/fetch-info/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (res.status === 200) {
            const data = res.data;
            return data;
        } else {
            throw new Error('Request failed with status: ' + res.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('There was an error with the network request');
    }
};

const Navbar: React.FC<SessionInfo> = ({ session }) => {
    const [settings, setSettings] = useState<InfoType | undefined>(undefined);

    useEffect(() => {
      fetchInfo()
          .then((data: InfoType) => {
              setSettings(data);
              console.log(settings)
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
          });
    }, []);
  
    return (
      <div className='h-12 bg-pajoy1 flex flex-row justify-between items-center px-4'>
        <div className='w-1/2 flex flex-row justify-center items-center gap-x-4 text-lg'>
          <Link href={`https://wa.me/${settings?.phone}`} target="_blank" rel="noopener noreferrer">
              <button className='bg-whatsapp-default hover:bg-whatsapp-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><FaWhatsapp/></button>
          </Link>
          <Link href={`${settings?.facebook}`} target="_blank" rel="noopener noreferrer">
              <button className='bg-facebook-default hover:bg-facebook-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><FaFacebookF/></button>
          </Link>
          <Link href={`${settings?.instagram}`} target="_blank" rel="noopener noreferrer">
              <button className='bg-instagram-default hover:bg-instagram-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><FaInstagram/></button>
          </Link>
          <p className='flex flex-row items-center justify-center gap-x-4 border-l border-white pl-4 text-sm'>
            <span>NIT</span><span>{settings?.nit}</span>
          </p>
        </div>
        <div className='w-1/2 flex flex-row justify-center items-center gap-x-4'>
            <a href="#" className="text-gray-100 transition hover:opacity-75"> {settings?.email}</a>
            <div className='flex flex-row items-center justify-center gap-x-4 border-l border-white pl-4'>
                <FaPhoneVolume  />
                <span className='text-sm'>{settings?.phone}</span>
            </div>
        </div>
      </div>
    );
  };
  
  export default Navbar
  
