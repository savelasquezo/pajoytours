import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { NextResponse } from 'next/server';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CircleLoader from 'react-spinners/CircleLoader';

import GMaps from "@/utils/gMaps";

import { SessionInfo, ToursType, Tour } from '@/lib/types/types';

import { AiOutlineClose } from 'react-icons/ai'
import Email from 'next-auth/providers/email';

export const fetchTours = async (name: string, price: string, fecha: string, selectedButton: any): Promise<ToursType> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/fetch-tours`,
      {
        headers: { 'Content-Type': 'application/json', },
        params: { name, price, fecha, ...selectedButton },
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

const Gallery: React.FC<SessionInfo> = ({ session }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [name, setNombre] = useState<string>('');
  const [price, setCosto] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Tour | null>(null);
  const [selectedButton, setSelectedButton] = useState({ tour: false, airway: false, excursion: false, });
  const [isLoading, setIsLoading] = useState(true);

  const [searchParam, setSearchParam] = useState(true);
  const searchParams = useSearchParams();

  const [count, setCount] = useState(1);
  const [voucher, setVoucher] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const increment = (places: number) => {
    if (!registrationSuccess) {
      setCount(count < places ? count + 1: count);
    }
  };

  const decrement = () => {
    if (!registrationSuccess) {
      setCount(count > 0 ? count - 1 : 0);
    }
  };


  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');

  const handlePhoneChange = (value: string, country: string, e: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
    setPhone(formattedValue);
  };
  
  const [formData, setFormData] = useState({
      phone: '',
      fullname: '',
      count: '',
      identification: '',
      birthdate: '',
    });

  const {fullname, identification, birthdate} = formData;
  const [agreed, setAgreed] = useState(true);
  const toggleAgreed = () => {
    if (agreed) {
      setAgreed(false);
    } else {
      setAgreed(true);
    }
  };

  useEffect(() => {
    const type = searchParams.get('type')
    fetchTours(name, price, fecha, selectedButton)
      .then((data: ToursType) => {
        setTours(data.results);
        setIsLoading(false);
        if (searchParam) {
          if (type && (type === 'tour' || type === 'airway' || type === 'excursion')) {
            setSelectedButton(prevState => ({
              tour: type === 'tour',
              airway: type === 'airway',
              excursion: type === 'excursion',
            }));
            setSearchParam(false)
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, [name, price, fecha, selectedButton]);

  

  type ButtonName = 'tour' | 'airway' | 'excursion';

  const handleButtonClick = (button: ButtonName) => {
    setSelectedButton((prevState) => ({
      ...prevState,
      [button]: !prevState[button],
    }));
  };

  const openModal = (card: Tour) => {
    setSelectedCard(card);
    setActiveTab("info");
    setShowModal(true);
    setRegistrationSuccess(false);
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setShowModal(false);
      setClosingModal(false);
    }, 500);
  };

  const redirectLogin = () => {
    setClosingModal(true);
    setTimeout(() => {
      setShowModal(false);
      setClosingModal(false);
      router.push('?login=true');
    }, 500);
  };



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/request-tour/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          tour: selectedCard?.id,
          fullname,
          count,
          phone,
          email: session?.user.email,
          identification,
          birthdate,
          agreed,
        }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setError("¡Ups! Ha ocurrido un error");
      }
      setRegistrationSuccess(true);
      setVoucher(data.voucher)
      setSuccess("¡Genial! La reserva se ha realizado correctamente");

      NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });

    } finally  {
      setLoading(false);
    }
    
  };

  return (
    <section className='w-full h-full mb-14'>
      <div className="w-full mb-8 p-0">
        <div className="flex flex-row items-center justify-center md:justify-start gap-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg h-20 transition-all duration-300 animate__animated animate__fadeIn">
          <div className='flex-row items-center justify-start hidden lg:flex'>
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
          </div>
          <div className="relative h-10 flex flex-row gap-x-2 text-xs">
            <button onClick={() => handleButtonClick('tour')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.tour ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Tours
            </button>
            <button onClick={() => handleButtonClick('airway')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.airway ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Airway
            </button>
            <button onClick={() => handleButtonClick('excursion')} className={`px-4 py-2 uppercase border border-gray-200 font-semibold rounded-md transition duration-300 focus:outline-none ${selectedButton.excursion ? 'bg-blue-700 text-white' : 'text-gray-600'}`}>
              Excursions
            </button>
          </div>
        </div>
      </div>
      <div className='w-full min-h-[calc(100vh-19rem)]'>
        {isLoading ? (
          <div className='h-[calc(100vh-19rem)] w-full flex items-center justify-center'>
            <img src="assets/animations/spinner1.gif" alt='' />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-12 transition-all duration-500 animate__animated animate__fadeIn">
            {tours.map((card, index) => (
              <button key={card.id} onClick={() => openModal(card)} className="overflow-hidden rounded-lg shadow-2xl h-full hover:scale-105 transition-all duration-300 animate__animated animate__fadeIn">
                <img src={card.banner} alt="" className="w-full h-auto bg-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      {showModal && selectedCard && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
          <div className="w-4/5 md:w-2/5 lg:w-3/5 h-auto lg:h-[65%] max-w-3xl relative flex justify-start items-center rounded-2xl bg-blue-50 shadow-2xl">
            <div className="relative flex flex-row w-full h-full p-0">
              <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300 z-50'><AiOutlineClose /></button>
              <img src={selectedCard.banner} alt="" className="w-auto h-full bg-contain rounded-l-2xl hidden lg:block" />
              <div className={`relative w-full h-full py-6 px-4 ${activeTab === 'info' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                <p className='text-center text-4xl uppercase mb-2'>{selectedCard.name}</p>
                <p className='text-justify text-xs lg:text-sm my-2'>{selectedCard.description}</p>
                <div className='h-64'>
                  {selectedCard && <GMaps googleMapsUrl={selectedCard.map} />}
                </div>
                <div className='absolute flex flex-row justify-between items-center bottom-20 w-11/12 bg-white p-2 lg:p-4 rounded-sm'>
                  <p className='text-gray-80 text-sm'>${selectedCard.price}</p>
                  <div className='flex flex-col gap-y-1 items-end'>
                    <p className='text-gray-800 text-sm'>{selectedCard.date}</p>
                    <p className='text-gray-800 text-sm'>{selectedCard.location}</p>
                  </div>
                </div>
                <div className='absolute bottom-4 w-11/12'>
                  {session && session?.user ? (
                    <Button onClick={() => switchTab('form')} color='cyan' fullWidth>Comprar</Button>
                  ) : (
                    <Button onClick={() => redirectLogin()} className='bg-red-500' fullWidth>Ingresar</Button>
                  )}
                </div>
              </div>
              <form method="POST" onSubmit={onSubmit} className={`relative w-full h-full py-6 px-4 ${activeTab === 'form' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                <div className='h-full flex flex-col items-center justify-between mt-4'>
                  <p className='text-center text-4xl uppercase mb-4'>CHECK-IN</p>
                  <div className="flex flex-col gap-y-2 w-11/12">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-3">
                        <label htmlFor="fullname">Nombre/Apellido</label>
                        <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                          type="text"
                          name="fullname"
                          id="fullname"
                          value={fullname}
                          onChange={(e) => onChange(e)}
                          readOnly={registrationSuccess}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="count">¿Cupos?</label>
                        <div className="h-10 w-full bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <span onClick={decrement} className="cursor-pointer outline-none focus:outline-none border-r border-gray-200 transition-all text-gray-500 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <input className="px-2 text-center appearance-none outline-none text-gray-800 w-full bg-transparent"
                            name="count"
                            id="count"
                            placeholder="1" 
                            value={count}
                            onChange={(e) => onChange(e)} 
                            readOnly={registrationSuccess}
                            required
                          />
                          <span onClick={() => increment(selectedCard.places)} className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-500 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="state">Telefono</label>
                        <div className="h-10 flex border bg-gray-50 rounded items-center mt-1">
                          <PhoneInput
                            country="co"
                            value={session?.user?.phone}
                            onChange={handlePhoneChange}
                            preferredCountries={['co', 'us']}
                            buttonClass={'!bg-transparent !border-0'}
                            inputProps={{ className: 'h-10 md:h-12 w-full indent-12 bg-gray-50 text-gray-800 font-thin outline-none' }}
                            prefix="+"
                            specialLabel={''}
                            alwaysDefaultMask={true}
                            defaultMask={'...-...-..-..'}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="email">Correo Electronico</label>
                        <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          type="text"
                          name="email"
                          id="email"
                          value={session?.user?.email}
                          onChange={(e) => onChange(e)} 
                          placeholder="email@domain.com"
                          readOnly
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label htmlFor="identification">Identificacion</label>
                        <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          type="number"
                          name="identification"
                          id="identification"
                          value={identification}
                          onChange={(e) => onChange(e)}
                          readOnly={registrationSuccess}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="birthdate">Nacimiento</label>
                        <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          type="date"
                          name="birthdate"
                          id="birthdate" 
                          value={birthdate}
                          onChange={(e) => onChange(e)}
                          readOnly={registrationSuccess}
                          required
                        />
                      </div>
                      {registrationSuccess ? (
                      <div className='md:col-span-5 h-[6.5rem] my-2'>
                        <div className='h-24 w-full flex flex-col justify-between items-baseline bg-white p-1 lg:p-2 rounded-sm'>
                          <div className='w-full'>
                            <div className='w-full flex flex-row items-start justify-between px-2'>
                              <p className='text-gray-800 text-sm font-semibold'>Indentificador:</p>
                              <p className='text-gray-800 text-sm font-semibold'>{voucher}</p>
                            </div>
                          </div>
                          <p className='px-2 text-[0.7rem] text-justify leading-none'>Enviamos un correo electronico a <span className='font-semibold'>{session?.user.email}</span> con los detalles de la reserva.</p>
                        </div>
                      </div>
                      ) : (
                      <div className='md:col-span-5 h-full'>
                        <div className="inline-flex items-center">
                          <input type="checkbox" onChange={toggleAgreed} defaultChecked={true} readOnly={registrationSuccess} name="check_terms" id="check_terms" className="form-checkbox" />
                          <label htmlFor="check_terms" className="ml-2 text-[0.65rem] lg:text-xs leading-none">Acepto recibir emails con promociones y el boletin semanal con toda la programacion, ofertas especiales.</label>
                        </div>
                        <div className='h-14 w-full flex flex-row justify-between items-center bg-white p-2 lg:p-4 rounded-sm my-4'>
                          <p className='text-gray-800 text-sm'>Total:</p>
                          <p className='text-gray-800 text-sm'>${selectedCard.price*count}</p>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                  {registrationSuccess ? (
                      <button className="w-full h-10 bg-green-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 cursor-default">
                        Confirmado
                      </button>
                      ) : loading ? (
                        <button className="w-full h-10 flex items-center justify-center bottom-4 bg-blue-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0">
                          <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                        </button>
                      ) : session?.user ? (
                        session.user.balance < selectedCard.price * count ? (
                          <div className="w-full h-10 bg-red-500 text-white px-6 py-2 font-xl rounded-md sm:mb-0 text-center">
                            Saldo Insuficiente
                          </div>
                        ) : (
                          <button type="submit" className="w-full h-10 bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300">
                            Confirmar
                          </button>
                        )
                      ) : (
                        <button onClick={() => redirectLogin()} className="w-full h-10 bg-red-500 hover:bg-red-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300">
                          Ingresar
                        </button>
                      )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};




export default Gallery;
