import React, { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';

import ImageGallery from "react-image-gallery";
import { GalleryInfo } from '@/lib/types/types';


export const fetchImagesGallery = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/fetch-gallery/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  }
}

const Images: React.FC = () => {

  const [imagesGallery, setImagesGallery] = useState<GalleryInfo[]>([]);
  useEffect(() => {
    fetchImagesGallery()
      .then((data) => {
        setImagesGallery(data);
        localStorage.setItem('imagesGallery', JSON.stringify(data));
      })
      .catch((error) => {
        NextResponse.json({ error: 'Server responded with an error' });
      });
  }, []);

  return (
    <section className="antialiased bg-white min-h-[calc(100vh-8.5rem)] text-gray-600 px-4">
      <ImageGallery items={imagesGallery} />;
    </section>
  );
};

export default Images;
