import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { NextResponse } from 'next/server';

import TicketsModal from "@/components/lotteries/components/ticketsModal";
import ListModal from "@/components/lotteries/components/listModal";

import { imageLoader } from '@/utils/imageConfig';
import { SessionInfo, LotteriData } from '@/lib/types/types';

import {AiOutlineClose, AiOutlineShoppingCart} from 'react-icons/ai'


export const fetchLotteries = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/fetch-lotteries/`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  }
}


const Lotteries: React.FC<SessionInfo> = ({ session  }) => {
    
    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState('');
    const [lotteri, setLotteri] = useState<string>('');

    const [itemsLotteri, setItemsLotteri] = useState<LotteriData[]>([]);

    const openModal = (tab: string, lotteri: string) => {
        setLotteri(lotteri);
        setShowModal(true);
        setActiveTab(tab);
    };

    const closeModal = () => {
        setClosingModal(true);
        setTimeout(() => {
            setShowModal(false);
            setClosingModal(false);
        }, 500);
    };

    useEffect(() => {
      fetchLotteries()
        .then((data) => {
            setItemsLotteri(data);
            localStorage.setItem('itemsLotteri', JSON.stringify(data));
        })
        .catch((error) => {
            NextResponse.json({ error: 'Server responded with an error' });
        });
        setIsLoading(false);
    }, []);

    return (
      <section className="antialiased bg-white min-h-[calc(100vh-8.5rem)] text-gray-600 px-4">
        {isLoading ? (
          <div className='h-[calc(100vh-19rem)] w-full flex items-center justify-center pt-[14rem]'>
            <img src="assets/animations/spinner1.gif" alt='' />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center py-4 px-12">
            {itemsLotteri?.length > 0 ? (
              (itemsLotteri).map((itemsLotteri, i) => (
                <button key={i} onClick={() => openModal('buyTicket', itemsLotteri.id)} className="relative overflow-hidden rounded-sm hover:scale-105 shadow-2xl transition-all duration-300 animate__animated animate__fadeIn">
                  <Image width={630} height={300} src={itemsLotteri.file} className="w-full h-40 md:h-96 lg:h-[30rem] bg-cover" loader={imageLoader} alt="" />
                  <div className="absolute top-0 h-2 w-full flex flex-row items-center gap-x-1">
                      <div className='absolute top-0 h-full w-full bg-gradient-to-r from-lime-500 to-red-500 transition-all duration-200'/>
                      <div className="absolute top-0 h-full w-full flex items-end justify-end">
                      <div className='h-full w-full flex  bg-white transition-all duration-200' style={{ width: `${itemsLotteri.progress}%` }} />
                      </div>
                  </div>
                </button>
              ))
            ) : null}
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
              <div className="relative w-10/12 max-w-sm flex justify-between items-center h-[30rem] rounded-2xl bg-white shadow-2xl">
                  <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                  <div className="w-full h-full p-6">
                    <button onClick={() => openModal('buyTicket',lotteri)} className={`text-gray-100 rounded-sm px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'buyTicket' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-300'}`}>Sorteo</button>
                    <button onClick={() => openModal('lstTicket',lotteri)} className={`text-gray-100 rounded-sm px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lstTicket' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-400'}`}>Tickets</button>
                    <div className={`${activeTab === 'buyTicket' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <TicketsModal closeModal={closeModal} session={session} obj={lotteri}/>
                    </div>
                    <div className={`h-full my-4 ${activeTab === 'lstTicket' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'none animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'buyTicket' ? 'hidden' : ''}`}>
                      <ListModal closeModal={closeModal} session={session} obj={lotteri}/>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
        )}
      </section>
    );
};

export default Lotteries;

