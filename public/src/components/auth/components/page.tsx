import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthModal from "@/components/auth/components/authModal";
import LoginModal from "@/components/auth/components/loginModal";
import RegisterModal from "@/components/auth/components/registerModal";
import ForgotPasswordModal from "@/components/auth/components/ForgotPasswordModal";
import ForgotPasswordConfirmModal from "@/components/auth/components/ForgotPasswordConfirmModal";

import AccountWallet from '@/components/wallet/index';

import { SessionInfo } from '@/lib/types/types';

import {AiOutlineClose, AiFillLock, AiFillUnlock} from 'react-icons/ai'
import { GiTwoCoins } from "react-icons/gi";


const Auth: React.FC<SessionInfo> = ({ session  }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const updateForgotPasswordModalState = (value: boolean): void => {
      setShowForgotPasswordModal(value);
    };
  
    const [activeTab, setActiveTab] = useState('login');
  
    useEffect(() => {
      if (searchParams.get('login')) {
        setShowModal(true);
        setActiveTab('login');
      }
      if (searchParams.get('singup')) {
        setShowModal(true);
        setActiveTab('singup');
      }
      if (searchParams.get('auth')) {
        setShowModal(true);
        setActiveTab('auth');
      }
      if (searchParams.get('forgot_password_confirm')) {
        setShowModal(true);
        setShowForgotPasswordModal(true);
        setActiveTab('forgot_password_confirm');
      }
      
    }, [searchParams]);


    const openModal = (tab: string) => {
      setShowModal(true);
      setActiveTab(tab);
    };
  
    const closeModal = () => {
      setClosingModal(true);
      setTimeout(() => {
        setShowModal(false);
        setClosingModal(false);
        router.push('/');
      }, 500);
    };

    return (
        <main className="inline-flex items-center h-full ml-5 gap-x-3 lg:w-2/5 lg:justify-end lg:ml-0 ">
            {session && session?.user? (
              <div className='inline-flex gap-x-4'>
                <div className='bg-gray-950 shadow-inner rounded-full py-1 px-4 inline-flex items-center justify-between w-40'>
                  <button onClick={() => openModal('wallet')} className='text-2xl text-gray-100 opacity-80 flex flex-row items-center gap-x-2'>
                    <GiTwoCoins/>
                    <p className='text-base'>$</p>
                  </button>
                  <p className='text-gray-100'>{session?.user?.balance ?? "0"}</p>
                </div>
                <button onClick={() => {signOut();}} className="bg-pink-700 hover:bg-pink-900 text-white uppercase text-xs font-semibold p-2 rounded transition-colors duration-300">Salir</button>
              </div>
              ) : (
              <div className='inline-flex gap-x-2'>
                <button onClick={() => openModal('login')} className="bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Ingresar</button>
                <button onClick={() => openModal('singup')} className="bg-pink-700 hover:bg-pink-900 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Inscribirse</button>
              </div>
            )}
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
                <div className={`${activeTab === 'wallet' ? 'w-1/5 md:w-2/5 h-1/2 xl:h-2/5' : 'w-4/5 md:w-3/5 lg:w-1/3 h-1/2 lg:h-3/5 xl:h-3/5'} realtive flex justify-start items-center rounded-2xl bg-gray-800 shadow-2xl`}>
                  <div className="relative w-full h-full p-6">
                    <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                    <div className={`${activeTab !== 'wallet' ? 'block' : 'hidden'}`}>
                      <div className={`flex flex-row w-full items-center ${activeTab === 'auth' ?  'hidden' : ''}`}>
                        <button onClick={() => openModal('login')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'login' ?  'bg-red-500 hover:bg-red-600' : ''}`}>Ingresar</button>
                        <button onClick={() => openModal('singup')} className={`text-gray-100 rounded-full px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'singup' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Inscribirse</button>
                        {showForgotPasswordModal ? (
                          <button onClick={() => openModal('forgot_password_confirm')} className={`text-gray-100 rounded-full px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'forgot_password_confirm' ? 'bg-green-600 hover:bg-green-700' : ''}`}><AiFillUnlock/></button>
                          ) : (
                          <button onClick={() => openModal('forgot-password')} className={`text-gray-100 rounded-full px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'forgot-password' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}><AiFillLock/></button>
                          )}
                      </div>
                    </div>
                    <div className={`w-full h-full my-4  ${activeTab === 'login' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <LoginModal closeModal={closeModal}/>
                      <div className="text-start items-center inline-flex gap-x-2">
                        <p className="text-xs text-gray-300">¿No tienes una cuenta?</p>
                        <button onClick={() => openModal('singup')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Inscribete</button>
                      </div><br />
                      <button onClick={() => openModal('forgot-password')} className="hover:underline text-xs text-blue-500">¿Olvidaste la contraseña?</button>
                    </div>
                    <div className={`w-full h-full my-4 ${activeTab === 'singup' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <RegisterModal closeModal={closeModal}/>
                      <div className="inline-flex gap-x-2 items-center">
                        <p className="text-xs text-gray-300">¿Ya tienes una cuenta?</p>
                        <button onClick={() => openModal('login')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                      </div>
                    </div>
                    <div className={`w-full h-full my-4 ${activeTab === 'forgot-password' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <ForgotPasswordModal closeModal={closeModal}/>
                      <div className="inline-flex gap-x-2 items-center">
                        <p className="text-xs text-gray-300">¿Ya tienes una cuenta?</p>
                        <button onClick={() => openModal('login')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                      </div>
                    </div>
                    <div className={`w-full h-full my-4 ${activeTab === 'forgot_password_confirm' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <ForgotPasswordConfirmModal closeModal={closeModal} updateForgotPasswordModalState={updateForgotPasswordModalState}/>
                      <div className="inline-flex gap-x-2 items-center">
                        <p className="text-xs text-gray-300">¿Ya tienes una cuenta?</p>
                        <button onClick={() => openModal('login')} className="cursor-pointer text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                      </div>
                    </div>
                    <div className={`w-full h-full my-4 ${activeTab === 'wallet' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <AccountWallet />
                    </div>
                    <div className={`w-full h-full my-4 ${activeTab === 'auth' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
                      <AuthModal closeModal={closeModal} />
                    </div>
                  </div>
                </div>
              </div>
          )}
        </main>
    );
};

export default Auth