import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircleLoader from 'react-spinners/CircleLoader';
import { Typography, IconButton, Button, Input, Textarea } from "@material-tailwind/react";

import { getSettings } from '@/utils/getSettings';
import RecaptchaV3 from '@/utils/recaptcha';

import { SessionInfo } from '@/lib/types/types';


const Contact: React.FC<SessionInfo> = () => {
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [settings, setSettings] = useState<{ [key: string]: any } | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedSettings = getSettings();
    if (fetchedSettings) {
      setSettings(fetchedSettings);
      setIsLoading(false);
    }
  }, []);

  const handleCaptchaVerify = async (token: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/recaptcha-verify/`, { token });
      const data = response.data;
      if (data.success) {
        setCaptchaVerified(true);
      } else {
        setCaptchaVerified(false);
      }
    } catch (error) {
      console.error('Error verifying CAPTCHA:', error);
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!captchaVerified) {
      alert("Please verify CAPTCHA first.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : {};
      if (!data.error) {
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <section className="antialiased bg-white min-h-[calc(100vh-8.5rem)] text-gray-600 px-4">
      {isLoading ? (
        <div className='h-[calc(100vh-19rem)] w-full flex items-center justify-center pt-[14rem]'>
          <img src="assets/animations/spinner1.gif" alt='' />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-4">
            <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
              <p className="text-base font-semibold uppercase tracking-wide text-blue-600">Informacion</p>
              <h2 className="font-heading mb-4 font-bold tracking-tight text-gray-900 text-3xl sm:text-5xl uppercase">Contacto</h2>
              <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">¿Necesitas mas informacion o tienes preguntas sobre nuestros servicios?</p>
            </div>
          </div>
          <div className="flex items-stretch justify-center">
            <div className="grid md:grid-cols-2">
              <div className="h-full pr-6">
                <p className="mt-3 mb-12 text-base text-gray-600 text-justify">
                  ¿Tienes alguna pregunta o necesitas más información? Estamos aquí para ayudarte. Envíanos un mensaje y nuestro equipo estará encantado
                  de aclarar tus dudas y ofrecerte información personalizada.                            </p>
                <ul className="mb-6 md:mb-0">
                  <li className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" className="h-6 w-6">
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                        <path
                          d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z">
                        </path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Localizacion
                      </h3>
                      <p className="text-gray-600">{settings?.address}</p>
                      <p className="text-gray-600">{settings?.location}</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" className="h-6 w-6">
                        <path
                          d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2">
                        </path>
                        <path d="M15 7a2 2 0 0 1 2 2"></path>
                        <path d="M15 3a6 6 0 0 1 6 6"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Contacto
                      </h3>
                      <p className="text-gray-600">Telefono: {settings?.phone}</p>
                      <p className="text-gray-600">Email: {settings?.email}</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" className="h-6 w-6">
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                        <path d="M12 7v5l3 3"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Horario de Atencion</h3>
                      <p className="text-gray-600">Lunes - Viernes: {settings?.start_attention.slice(0, 5)} - {settings?.end_attention.slice(0, 5)}</p>
                      <p className="text-gray-600">Sabados &amp; Domingos: {settings?.start_attention.slice(0, 5)} - {settings?.special_attention.slice(0, 5)}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="h-fit max-w-6xl py-2 px-5 md:px-12 md:py-4" id="form">
                <form onSubmit={handleSubmit} id="contactForm">
                  <div className="mb-6">
                    <div className="mx-0 mb-1 sm:mb-4">
                      <label className="pb-1 text-xs uppercase tracking-wider"></label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md sm:mb-0"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mx-0 mb-1 sm:mb-4">
                      <label className="pb-1 text-xs uppercase tracking-wider"></label>
                      <input
                        type="text"
                        id="subject"
                        placeholder="Asunto"
                        className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md sm:mb-0"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mx-0">
                    <label className="pb-1 text-xs uppercase tracking-wider"></label>
                    <textarea
                      rows={8}
                      id="message"
                      name="message"
                      placeholder=""
                      className="mb-2 w-full h-40 rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md sm:mb-0"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col text-center gap-y-2">
                    <div className='h-20'>
                      <RecaptchaV3 onVerify={handleCaptchaVerify} />
                    </div>
                    {registrationSuccess ? (
                      <button className="w-full bg-green-800 text-white px-6 py-3 font-xl rounded-md sm:mb-0">Enviado</button>
                    ) : (
                      loading ? (
                        <button type="button" className="w-full bg-blue-500 text-white px-6 py-3 font-xl rounded-md sm:mb-0 text-center flex items-center justify-center">
                          <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                        </button>
                      ) : (
                        <button type="submit" className={`w-full bg-blue-800 text-white px-6 py-3 font-xl rounded-md sm:mb-0 ${captchaVerified ? '' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!captchaVerified}>
                          Enviar
                        </button>
                      )
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
