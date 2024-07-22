import React, { useState, useEffect } from "react";
import axios from 'axios';

import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

import { NextResponse } from 'next/server';
import { SettingsType } from '@/lib/types/types';

interface Settings {[key: string]: any;}

const WhatsApp: React.FC = () => {
const [info, setInfo] = useState<SettingsType | undefined>(undefined);
const fetchSettings = async () => {
    try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/fetch-information/`);
    const settings: Settings = response.data;
    const formattedSettings: Settings = { ...settings };
    localStorage.setItem('settings', JSON.stringify(formattedSettings));
    } catch (error) {
    console.error('Error fetching settings:', error);
    }
};

useEffect(() => {
    fetchSettings();
    const storedInfo = localStorage.getItem('settings');
    if (storedInfo) {
    try {
        const parsedInfo = JSON.parse(storedInfo);
        setInfo(parsedInfo);
    } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
    }
}, []);

  return (
    <WhatsAppWidget
        phoneNo={`57${info?.phone}`}
        position="rigth"
        widgetWidth="360px"
        widgetWidthMobile="360px"
        autoOpen={false}
        autoOpenTimer={5000}
        messageBox={true}
        messageBoxTxt="Hola PajoyTours, Necesito Informacion"
        iconSize="45"
        iconColor="white"
        iconBgColor="#25d366"
        headerIcon={`/assets/images/icon00.png`}
        headerIconColor="red"
        headerTxtColor="black"
        headerBgColor="#25d366"
        headerTitle="PajoyTours"
        headerCaption="Online"
        bodyBgColor="#ffff"
        chatPersonName="Support"
        chatMessage={<>¡Bienvenido a PajoyTours! 👋 <br /><br /> ¿Como puedo ayudarte?</>}
        footerBgColor="#999"
        placeholder="Escribe un Mensaje"
        btnBgColor="#25d366"
        btnTxt="Chatear Ahora"
        btnTxtColor="black"
        style={{ border: 'none' }}
    />
  );
};

export default WhatsApp;
