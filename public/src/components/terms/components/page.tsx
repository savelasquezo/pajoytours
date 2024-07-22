import React, { useState, useEffect } from 'react';
import { getSettings } from '@/utils/getSettings';

const Terms: React.FC = () => {
  const [settings, setSettings] = useState<{ [key: string]: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedSettings = getSettings();
    if (fetchedSettings) {
      setSettings(fetchedSettings);
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="antialiased bg-white min-h-[calc(100vh-8.5rem)] text-gray-600 px-4">
      {isLoading ? (
        <div className='h-[calc(100vh-19rem)] w-full flex items-center justify-center pt-[14rem]'>
          <img src="assets/animations/spinner1.gif" alt='' />
        </div>
      ) : (
        <div className='w-full h-full py-12 px-16'>
          <p className='w-full h-full text-4xl text-center border-b border-gray-300 mb-4 py-4'>Terminos y Condiciones</p>
          <br className='border-2 border-gray-800 text-gray-200 w-full h-1'/>
          <div dangerouslySetInnerHTML={{ __html: settings?.terms }} />
        </div>
      )}
    </section>
  );
};

export default Terms;
