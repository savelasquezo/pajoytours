import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SessionInfo, AdvertisementItem } from '@/lib/types/types';

const Advertisement: React.FC<SessionInfo> = () => {
  const [advertisementData, setAdvertisement] = useState<AdvertisementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/fetch-advertisement`);
        setAdvertisement(response.data.results);
      } catch (error) {
        console.error("Error fetching advertisement data", error);
      }
    };
    setIsLoading(false);
    fetchAdvertisement();
  }, []);

  return (
<div className="w-full h-full grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:gap-x-8 items-center justify-center px-12 ml-2 md:ml-6">
  {advertisementData.map((ad) => (
    <div key={ad.id} className="w-72 lg:w-[30rem] mb-8 flex flex-col hover:shadow-2xl hover:scale-105 transition duration-500 ease-in-out">
      <div className="rounded overflow-hidden shadow-lg flex flex-col">
        <a href="#"></a>
        <div className="relative">
          <a href="#">
            <img className="w-full h-full bg-contain max-h-[30rem]" src={ad.banner} alt={ad.name} />
            <div className="absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-10"></div>
          </a>
          <a href="#!">
            <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3">
              {ad.name}
            </div>
          </a>
        </div>
        <div className="px-6 py-4 h-28 overflow-hidden flex-grow bg-white">
          <p className="font-medium text-ellipsis text-sm lg:text-base text-gray-700 mb-2">
            {ad.description}
          </p>
        </div>
        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
          <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
            <svg height="13px" width="13px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
              <g>
                <g>
                  <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z">
                  </path>
                </g>
              </g>
            </svg>
            <span className="ml-2">{ad.date}</span>
          </span>
        </div>
      </div>
    </div>
  ))}
</div>

  );
};

export default Advertisement;
