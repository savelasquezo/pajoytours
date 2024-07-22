import React, { useState } from 'react';
import { SessionInfo } from '@/lib/types/types';
import { useSession } from 'next-auth/react';
import Auth from '@/components/auth/components/page';

const Header: React.FC<SessionInfo> = ({ session }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header>
            <nav className="h-16 border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="items-center flex">
                        <img src="assets/images/icon00.png" className="h-8 sm:h-10" alt="PJ" />
                        <span className="self-center ml-2 text-3xl font-poppins whitespace-nowrap text-white hidden md:block">PajoyTours</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        <Auth session={session} />
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                            aria-controls="mobile-menu-2"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">MENU</span>
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1 z-50 bg-gray-800 lg:bg-transparent rounded-b-xl`} id="mobile-menu-2">
                        <ul className="flex h-12 lg:h-auto px-12 lg:p-2 flex-row justify-between items-center font-medium space-x-1 lg:space-x-8 lg:mt-0 text-xs lg:text-base">
                            <li><a href="/gallery?type=all" className="block py-2 border-b lg:border-0 g:p-0 text-gray-400 lg:hover:text-white hover:text-white lg:hover:bg-transparent border-gray-800">Tours</a></li>
                            <li><a href="/schedule" className="block py-2 border-b lg:border-0 g:p-0 text-gray-400 lg:hover:text-white hover:text-white lg:hover:bg-transparent border-gray-800">Calendario</a></li>
                            <li><a href="/lotteries" className="block py-2 border-b lg:border-0 g:p-0 text-gray-400 lg:hover:text-white hover:text-white lg:hover:bg-transparent border-gray-800">Loterias</a></li>
                            <li><a href="/contact" className="block py-2 border-b lg:border-0 g:p-0 text-gray-400 lg:hover:text-white hover:text-white lg:hover:bg-transparent border-gray-800 rounded-b-full">Contacto</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
