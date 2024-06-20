import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

import { SessionInfo, ToursType, Tour } from '@/lib/types/types';

import { CiEraser, CiSearch } from "react-icons/ci";

export const fetchTours = async (name: string, price: string, fecha: string, selectedButton: any): Promise<ToursType> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-tours`,
      {
        headers: { 'Content-Type': 'application/json', },
        params: {name, price, fecha, ...selectedButton },
      }
    );
    if (res.status === 200) { 
      const data = res.data; 
      return data; 
    }
    throw new Error('Request failed with status: ' + res.status);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('There was an error with the network request');
  }
};

const Gallery: React.FC<SessionInfo> = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [name, setNombre] = useState<string>('');
  const [price, setCosto] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');

  const [selectedButton, setSelectedButton] = useState({
    tours: false,
    airway: false,
    excursions: false,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTours(name, price, fecha, selectedButton)
      .then((data: ToursType) => {
        setTours(data.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [searchParams, name, price, fecha, selectedButton]);

  type ButtonName = 'tours' | 'airway' | 'excursions';

  const handleButtonClick = (button: ButtonName) => {
    setSelectedButton((prevState) => ({
      ...prevState,
      [button]: !prevState[button],
    }));
  };

  return (
    <div className='w-full h-full mb-14'>
      <div className="w-full mb-8 p-0">
        <div className="flex flex-row items-center justify-start gap-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg h-20">

          <div className="relative w-48 h-10">
            <input 
              type="text" 
              className="text-gray-900 peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-600" 
              value={name}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-600 before:border-blue-gray-200 peer-focus:before:!border-gray-600 after:border-blue-gray-200 peer-focus:after:!border-gray-600">
              Nombre
            </label>
          </div>
          <div className="relative w-48 h-10">
            <input 
              type="number" 
              className="text-gray-900 peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-600" 
              value={price}
              onChange={(e) => setCosto(e.target.value)}
            />
            <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-600 before:border-blue-gray-200 peer-focus:before:!border-gray-600 after:border-blue-gray-200 peer-focus:after:!border-gray-600">
              Costo
            </label>
          </div>

          <div className="relative w-48 h-10">
            <input 
              type="date" 
              className="text-gray-900 peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-600" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-600 before:border-blue-gray-200 peer-focus:before:!border-gray-600 after:border-blue-gray-200 peer-focus:after:!border-gray-600">
              Fecha
            </label>
          </div>

          <div className="relative h-10 flex flex-row gap-x-2 text-xs">
            <button onClick={() => handleButtonClick('tours')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.tours ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Tours
            </button>
            <button onClick={() => handleButtonClick('airway')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.airway ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Airway
            </button>
            <button onClick={() => handleButtonClick('excursions')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.excursions ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Excursions
            </button>
          </div>


        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-12">
        {tours.map((card: Tour) => (
          <div key={card.id} className="overflow-hidden rounded-lg shadow-2xl h-full hover:scale-105 transition-all duration-300">
            <img src={card.banner} alt="" className="w-full h-auto bg-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
