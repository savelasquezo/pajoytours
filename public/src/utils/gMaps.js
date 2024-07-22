import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const GMaps = ({ googleMapsUrl }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const regex = /@([-0-9.]+),([-0-9.]+)/;
    const match = googleMapsUrl.match(regex);
    if (match && match.length === 3) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [googleMapsUrl]);

  const mapStyles = {
    height: '100%',
    width: '100%',
  };

  const defaultCenter = {
    lat: latitude || 37.7749,
    lng: longitude || -122.4194,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={15}
      center={defaultCenter}
    >
      {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
    </GoogleMap>
  );
};

export default GMaps;
