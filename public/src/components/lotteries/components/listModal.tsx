import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import useInterval from '@use-it/interval';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { SessionModal, TicketsDetails } from '@/lib/types/types';

export const fetchLotteriTickets = async (accessToken: any, obj: string, page: number = 1) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/fetch-lotteri-tickets/${obj}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`,
            },
        });

        if (!res.ok) {
            throw new Error('Server responded with an error');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return { results: [], count: 0 };
    }
}

const ListModal: React.FC<SessionModal & { obj: string }> = ({ closeModal, session, obj }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [tickets, setTickets] = useState<TicketsDetails[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const TicketsPage = 10;

    const fetchData = async (page: number = 1) => {
        if (session) {
            const accessToken = session?.user?.accessToken;
            try {
                const { results, count } = await fetchLotteriTickets(accessToken, obj, page);
                setTickets(results || []);
                setPageCount(Math.ceil(count / TicketsPage));
            } catch (error) {
                console.error('There was an error with the network request:', error);
            }
        }
    };

    useEffect(() => {
        fetchData(pageNumber + 1);
    }, [session, pageNumber]);

    const changePage = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
    };

    const router = useRouter();
    const openLogin = () => {
        closeModal();
        router.push('/?login=True');
    };

    return (
        <div className='w-full h-full'>
            <div className="relative h-[calc(100%-4rem)] w-full text-gray-500">
                {session && session?.user ? (
                    tickets.length > 0 ? (
                        <div>
                            <table className="min-w-full text-center text-sm font-light">
                                <thead className="font-medium text-gray-600">
                                    <tr className="border-b-2 border-slate-400 uppercase text-xs">
                                        <th scope="col" className=" px-6 py-2">Ticket</th>
                                        <th scope="col" className=" px-6 py-2 hidden sm:table-cell">PIN</th>
                                        <th scope="col" className=" px-6 py-2">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((obj, index) => (
                                        <tr key={index} className="border-b border-slate-300 uppercase text-xs text-gray-900 text-center align-middle">
                                            <td className="whitespace-nowrap px-6 py-1 font-courier font-semibold text-sm">{obj.ticket}</td>
                                            <td className="whitespace-nowrap px-6 py-1 font-courier">{obj.voucher}</td>
                                            <td className="whitespace-nowrap px-6 py-1 font-courier">{obj.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel={<MdNavigateBefore />}
                                nextLabel={<MdNavigateNext />}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={5}
                                onPageChange={changePage}
                                className={'absolute -bottom-1 w-full flex flex-row items-center justify-center gap-x-2'}
                                pageClassName={'text-gray-700 rounded-full !px-3 !py-1 transition-colors duration-300'}
                                activeClassName={'text-blue-800 font-semibold rounded-full !px-3 !py-1 transition-colors duration-300'}
                                previousClassName={'absolute left-5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
                                nextClassName={'absolute right-5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
                            />
                        </div>
                    ) : (
                        <div className='w-full h-full flex flex-col justify-start items-center'>
                            <span className='text-center text-gray-800 my-4 text-[0.55rem] md:text-xs'>
                                <p>¡Aun no has adquirido ningún ticket para esta lotería!</p>
                                <p>Adquiérelo ahora y participa en el siguiente sorteo.</p>
                            </span>
                        </div>
                    )
                ) : (
                    <div className='w-full h-full flex flex-col justify-start items-center'>
                        <span className='text-center text-gray-300 my-4 text-[0.55rem] md:text-xs'>
                            <p>¡Requerido Inicio de Sesión!</p>
                            <p>El historial de ticket solo está disponible para usuarios registrados.</p>
                        </span>
                        <button onClick={openLogin} className="w-1/4 bg-red-500 hover:bg-red-700 text-black text-sm font-semibold py-1 px-2 rounded transition-colors duration-300">Ingresar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListModal;
