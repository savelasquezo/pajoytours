import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SessionInfo, ScheduleItem } from '@/lib/types/types'; // Asegúrate de importar el tipo actualizado

const Schedule: React.FC<SessionInfo> = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/manager/fetch-schedule`);
        setScheduleData(response.data.results);
      } catch (error) {
        console.error("Error fetching schedule data", error);
      }
    };
    setIsLoading(false);
    fetchSchedule();
  }, []);

  return (
    <section className="antialiased bg-white min-h-[calc(100vh-8.5rem)] text-gray-600 px-4">
      {isLoading ? (
        <div className='h-[calc(100vh-19rem)] w-full flex items-center justify-center pt-[14rem]'>
          <img src="assets/animations/spinner1.gif" alt='' />
        </div>
      ) : (
        <div className="flex flex-col justify-start h-full">
          <div className="w-ful w-3/4 mx-auto mt-12 mb-24 bg-white shadow-lg rounded-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              {scheduleData.length > 0 && (

                <div className='flex flex-col text-center'>
                  <p className="text-4xl font-medium text-gray-800 uppercase">{scheduleData[0].name}</p>
                  <p className='uppercase text-2xl'>Calendario</p>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <tbody className="text-sm divide-y divide-gray-100">
                    {scheduleData.map(schedule => (
                      <React.Fragment key={schedule.id}>
                        {schedule.items.map(item => (
                          <tr key={item.id} className=''>
                            <td className="p-2 whitespace-nowrap rounded-l-full">
                              <img className="rounded-full w-12 h-12" src={item.banner} alt={item.name} />
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-medium text-gray-800">{item.name}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-left">{item.date}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-left">{item.location}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap rounded-r-full">
                              <div className="text-left">{item.description}</div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Schedule;
