import React, { useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { LuRefreshCw } from "react-icons/lu";
import { NextResponse } from 'next/server';

import CircleLoader from 'react-spinners/CircleLoader';

import { getRandomTickets } from '@/utils/getRandomTickets'
import { SessionModal, LotteriData } from '@/lib/types/types';


const TicketsModal: React.FC<SessionModal & { obj: string }> = ({ closeModal, session, obj }) => {

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [stateNumber, setStateNumber] = useState(true);

  const router = useRouter();

  const [lotteri, setLotteri] = useState<LotteriData>();
  const [voucher, setVoucher] = useState('');
  const [ticketsSuccess, setTicketsSuccess] = useState(false);

  const [listTickets, setListTickets] = useState<string[]>([]);
  const [aviableTickets, setAviableTickets] = useState<string[]>([]);

  const [enteredLength, setEnteredLength] = useState<number>();
  const [generateNewNumbers, setGenerateNewNumbers] = useState<boolean>(true);

  const handleGenerateNewNumbers = () => {
    setGenerateNewNumbers(true);
  };

  const setNumber = (obj: string): void => {
    setStateNumber(true);
    setError('');
    setFormData({
      ...formData,
      ticket: obj.toString(),
    });
  };


  useEffect(() => {
    const websocketURL = `${process.env.NEXT_PUBLIC_WEBSOCKET_APP}/app/ws/tickets_lotteri/${obj}/`;
    const client = new W3CWebSocket(websocketURL);

    client.onmessage = (message) => {
      let data;
      try {
        data = JSON.parse(message.data as string);

        if (data.tickets && data.tickets.length > 0 && data.tickets[0]) {
          setEnteredLength(data.tickets[0].length);
        }

        if (generateNewNumbers) {
          const randomTickets = getRandomTickets(data.tickets, 5);
          setAviableTickets(data.tickets);
          setLotteri(data.lotteri);
          setTimeout(() => {
            setListTickets(randomTickets.map(String));
            setGenerateNewNumbers(false);
            setIsLoading(false)
          }, 1000);
        }
      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, [generateNewNumbers, obj]);

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    ticket: '',
  });

  const { ticket, email } = formData;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStateNumber(true);
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (ticketsSuccess) {
      setGenerateNewNumbers(true);
      setTicketsSuccess(false)
      setFormData({
        ...formData,
        ticket: '',
      });
      setLoading(false);
      return
    }

    if (!session?.user) {
      setError('¡Error - Inicio de Session!');
      setLoading(false);
      return;
    }

    if (!lotteri) {
      setError('¡Error Inesperado! Intentelo Nuevamente');
      setLoading(false);
      return;
    }

    if ((session.user.balance < lotteri.price)) {
      setError('¡Saldo Insuficiente!');
      setLoading(false);
      return;
    }

    const isTicketValid = /^[0-9]+$/.test(ticket.toString());
    if (!isTicketValid && ticket !== null) {
      setError('¡Error - Ingrese un Ticket Valido!');
      setLoading(false);
      return;
    }

    if (!aviableTickets.includes(ticket)) {
      setError('¡Lamentablemente ya ha sido Adquirido!');
      setStateNumber(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/request-ticketlotteri/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            email,
            ticket,
            obj,
          }),
        });

      const data = await res.json();

      if (!data.error) {
        setVoucher(data.voucher);
        setSuccess('¡Adquirido! Enviamos el Ticket a tu email');
        if (session && session.user) {
          session.user.balance = data.newBalance;
        }
        const requestOptions = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          }
        };
      }
    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });

    } finally {
      handleGenerateNewNumbers();
      setTicketsSuccess(true)
      setLoading(false);
    }
  };

  const openLogin = () => {
    closeModal()
    router.push('/?login=True');
  };

  return (
  <section className="w-full h-full flex flex-col py-2">
    {isLoading ? (
      <div className='w-full h-full flex items-center justify-center pt-36'>
        <img src="assets/animations/spinner2.gif" alt='' />
      </div>
    ) : (
      <div className='w-full h-full flex flex-col py-2'>
        {(listTickets.length > 0 && lotteri) ? (
          <div className='w-full flex flex-col items-start justify-start animate-fade-in animate__animated animate__fadeIn'>
            <div className='relative w-full h-full flex flex-col justify-start items-center mt-12 mb-4'>
              <p className='absolute -top-10 text-gray-900 text-[0.6rem] sm:text-xs text-center'>{ticketsSuccess ? `Has adquirido el número correctamente, el sorteo se realizará el ${lotteri.date} no dejes perder esta oportunidad` : 'Digita un número o selecciona uno aleatorio de la lista, solo podrás seleccionar números que aún no se han adquirido.'}</p>
              {!ticketsSuccess ? (
                <div className='w-full h-full'>
                  {generateNewNumbers ? (
                    <button type="button" className='h-6 w-full flex items-center justify-center text-xs bg-blue-600 opacity-80 text-white'><CircleLoader size={12} color='white' /></button>
                  ) : (
                    <button onClick={handleGenerateNewNumbers} className='h-6 w-full flex items-center justify-center text-xs bg-blue-800 hover:bg-blue-600 rounded-t-sm opacity-80 transition-colors duration-300 text-white'><LuRefreshCw /></button>
                  )}
                  <div className='relative w-full h-20 flex flex-row gap-x-1 lg:gap-x-2 justify-center bg-white shadow-current py-4 px-8 rounded-sm'>
                    {listTickets.map((obj, i) => (
                      <button key={i} onClick={() => setNumber(obj)} className='relative flex flex-row justify-center items-center text-slate-900 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-full p-6 md:p-7'>
                        <p className='absolute h-full w-full flex justify-center items-center text-sm md:text-base uppercase font-normal md:font-semibold underline'>{obj}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='w-full h-full shadow-inner'>
                  <div className='h-6 w-full flex items-center justify-center text-xs bg-blue-800 rounded-t-sm opacity-80 transition-colors duration-300 text-white'></div>
                  <div className='relativ w-full h-20 flex flex-row gap-x-1 lg:gap-x-2 justify-center bg-white shadow-current p-1 rounded-sm'>
                    <div className='w-full flex flex-col justify-between items-center bg-white p-1 pb-4 lg:p-2 rounded-sm'>
                      <div className='w-full'>
                        <div className='w-full flex flex-row items-start justify-between px-2'>
                          <p className='text-gray-800 text-sm font-semibold'>Voucher:</p>
                          <p className='text-gray-800 text-sm font-semibold'>{voucher}</p>
                        </div>
                      </div>
                      <p className='px-2 text-xs text-justify leading-none'>Enviamos un correo electronico a <span className='font-semibold'>{session?.user.email}</span> con los detalles del ticket.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form method="POST" className='w-full flex flex-col justify-start items-start gap-y-0 mt-6 pt-6 pb-1'>
              <div className='relative flex flex-col w-full h-32 justify-start items-center'>
                <div className='absolute -top-12 right-0'>
                  <span className='relative h-full w-full flex items-center'>
                    <Image width={256} height={256} src={"/assets/images/glump.webp"} alt="" className="w-auto h-20" />
                    <p className='absolute text-center text-3xl z-20 right-1/4 font-semibold text-slate-800 -mt-4'>{lotteri.price / 1000}K</p>
                    <p className='absolute text-center z-20 right-5 font-semibold text-slate-800 bottom-3'>COP</p>
                  </span>
                </div>
                <Image width={400} height={400} className="absolute h-40 w-auto object-cover z-10 -mt-12" src={ticketsSuccess ? "/assets/images/ballY.webp" : (stateNumber ? "/assets/images/ball.webp" : "/assets/images/ballX.webp")} alt="" />
                <input className="custom-placeholder absolute !bg-transparent font-semibold text-5xl text-center text-gray-800 border-none appearance-none outline-0 z-20"
                  type="text"
                  name="ticket"
                  id="ticket"
                  minLength={enteredLength}
                  maxLength={enteredLength}
                  value={ticket}
                  placeholder='?'
                  onChange={(e) => onChange(e)}
                  readOnly={ticketsSuccess}
                  required
                />
              </div>
              {loading ? (
                <button className="w-full h-10 flex items-center justify-center bottom-4 bg-blue-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0">
                  <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                </button>
              ) : session?.user ? (
                session.user.balance < lotteri.price ? (
                  <div className="w-full h-10 bg-red-500 text-white px-6 py-2 font-xl rounded-md sm:mb-0 text-center">
                    Saldo Insuficiente
                  </div>
                ) : !ticketsSuccess ? (
                  <button type="submit" onClick={handleSubmit} className="w-full h-10 bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300">
                    Confirmar
                  </button>
                ) : (
                  <button type="submit" onClick={handleSubmit} className="w-full h-10 bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300">
                    Volver
                  </button>
                )
              ) : (
                <button onClick={openLogin} className="w-full h-10 bg-red-500 hover:bg-red-600 text-white px-6 py-2 font-xl rounded-md sm:mb-0 transition-colors duration-300">
                  Ingresar
                </button>
              )}
            </form>
            {error && (<p className="text-red-800 font-semibold text-xs text-center w-full">{error}</p>)}
            {!error && (<p className="text-gray-700 text-xs text-center w-full">¿Necesitas Ayuda? support@pajoytours.com</p>)}
          </div>
        ) : (
          <div className='w-full h-full flex flex-col justify-start items-center mt-8'>
            <span className='text-center text-gray-300 my-4 text-sm'>
              <p>¡No hay Tickets disponibles para este Sorteo!</p>
              <p>El Sorteo se realizara el proximo dia 15</p>
            </span>
          </div>
        )}
      </div>
      )}
    </section>
  );
};

export default TicketsModal;
