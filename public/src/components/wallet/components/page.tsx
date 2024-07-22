import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NextResponse } from 'next/server';

import BeatLoader from 'react-spinners/BeatLoader';
import BoldButton from '@/utils/buttonBold';

import { SessionModal } from '@/lib/types/types';

import { FiDollarSign } from "react-icons/fi";


const WalletModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const [invoice, setInvoice] = useState('');
    const [amount, setAmount] = useState('');
    const [integritySignature, setIntegritySignature] = useState('');
    const [invoiceSuccess, setInvoiceSuccess] = useState(false);
  
    const [method, setMethod] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
    const [formData, setFormData] = useState({total: ''});
    const {total} = formData;
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  
    const onSubmit = async (e: React.FormEvent, method: string) => {
      e.preventDefault();
      setLoading(true);
      setSuccess('');
      setError('');
  
      await new Promise(resolve => setTimeout(resolve, 1500));
      const totalPattern = /^[1-9][0-9]+$/;
      if (!totalPattern.test(total) || parseInt(total, 0) < 10000 || parseInt(total, 0) > 20000000) {
        setError('¡Error - Ingrese un valor Valido entre 10.000 COP & 20.000.000 COP!');
        setLoading(false);
        return;
      }
      
  
      if (!method) {
        setError('¡Error - Seleccione un Metodo de Pago!');
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-invoice/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({    
            method,
            total,
          }),
        });
        const data = await res.json();
        if (!data.error) {
          setSuccess('¡Facturacion Exitosa!');
          setRegistrationSuccess(true);
          setMethod(method)
          setInvoice(data.apiInvoice);
          setIntegritySignature(data.integritySignature);
          setAmount(data.amount);
          setInvoiceSuccess(true);
        }
      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
      
      setLoading(false);
    };

  return (
    <div className="w-full h-full">
      <a href="/" className="flex items-start -mt-8">
          <img src="assets/images/icon00.png" className="h-8 sm:h-10" alt="PJ" />
          <span className="self-center ml-2 text-md font-poppins whitespace-nowrap dark:text-white">PajoyTours</span>
      </a>
      <hr className='border-slate-700 shadow-inner mt-4'/>
      <form className="h-full w-full text-gray-500 mt-4">
        <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
          <div className="relative flex flex-row justify-between w-full">
            <div className="w-full flex flex-col gap-y-1 leading-3 justify-center h-20">
              <div className="flex flex-row justify-start items-center gap-x-2">
                <span className="text-gray-400 my-1 text-xs uppercase">Agregar Fondos</span>
                { success && (<div className="text-lime-400 text-xs">{success}</div>)}
                { error && (<div className="text-red-400 text-xs">{error}</div>)}
              </div>
              <div className="relative h-8 w-full">
                <div className="absolute text-gray-500 text-lg top-2/4 left-2 grid h-5 w-5 -translate-y-2/4 items-center"><FiDollarSign/></div>
                <input className="h-full w-full indent-4 text-gray-200 rounded-sm border border-gray-800 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                    type="number"
                    name="total"
                    value={total}
                    onChange={(e) => onChange(e)}
                    min="10000"
                    max="20000000"
                    pattern="[0-9]*"
                    required
                    readOnly={invoiceSuccess}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center mt-4 mb-2 gap-y-4">
          {!registrationSuccess ? (
            loading ? (
              <div className='w-full h-full text-center'>
                <BeatLoader color="#ffff" loading margin={20} size={20} speedMultiplier={0.5}/>
              </div>
              ) : (
              <div className='w-full flex flex-col gap-y-4 items-start justify-center md:justify-start'>
                <div className="w-full flex flex-row gap-x-2">
                  <button onClick={(e) => onSubmit(e, "bold")} className=""><Image width={405} height={200} src={"/assets/images/bold0.webp"} className="object-fit w-40 h-8 md:w-44 md:h-10 shadow-lg rounded-full" alt="" /></button>
                </div>
                <div className='flex flex-col items-start justify-center'>
                  <p className='text-[0.55rem] text-justify text-gray-400'>Importante recordar que el saldo puede experimentar una breve demora antes de reflejarse en tu cuenta.
                    <span className='hidden md:inline'> Actualiza tu saldo desde tu wallet para obtener el estado actualizado de tus facturas</span>
                  </p>
                  <p className='text-[0.60rem] text-gray-300 mt-2'>¿Necesitas Ayuda? support@pajoytours.com</p> 
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-start gap-y-4">
              <div className="flex flex-row items-center justify-between w-full">
                <div className={`${method === 'bold' ? 'block' : 'hidden' }`}>
                    <BoldButton invoice={invoice} amount={amount} integritySignature={integritySignature}/>
                </div>
                <span className="bg-gray-900 flex items-center justify-center text-xs md:text-base rounded-sm py-2 px-4 text-white h-8 md:h-10 -mt-1">{invoice}</span>
              </div>
              <div className='text-[0.55rem] text-justify text-gray-400'>
                <p>Importante tener en cuenta que la actualización de tu saldo puede experimentar una breve demora antes de reflejarse en tu cuenta. ¿Necesitas Ayuda? support@pajoytours.com</p> 
              </div>
              <p className='text-[0.60rem] text-gray-300 -mt-2 -lg:mt-4'>¿Necesitas Ayuda? support@pajoytours.com</p> 
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default WalletModal;
