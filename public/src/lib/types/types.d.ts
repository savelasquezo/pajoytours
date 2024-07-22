
import { Session } from 'next-auth';

export type ImagesInfo = {
    settings: any;
    file: string;
};

export type GalleryInfo = {
    original: string;
    thumbnail: string;
};

export type SettingsType = {
    nit: string;
    phone: string;
    email: string;
    facebook: string;
    twitter: string;
    instagram: string;
    address: string;
    location: string;
    start_attention: string;
    end_attention: string;
    special_attention: string;
};

export type Tour = {
    id: string;
    type: string;
    name: string;
    banner: string;
    location: string;
    map: string;
    date: string;
    description: string;
    price: number;
    places: number;
    is_active: boolean;
};
  
export type ToursType = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tour[];
};

export type ScheduleItem = {
    id: number;
    uuid: string;
    name: string;
    date: string;
    is_active: boolean;
    items: {
        id: number;
        uuid: string;
        name: string;
        banner: string;
        location: string;
        date: string;
        description: string;
        is_active: boolean;
        schedule: number;
    }[];
};

export type AdvertisementItem = {
    id: number;
    uuid: string;
    name: string;
    banner: string;
    date: string;
    description: string;
    is_active: boolean;
};

export type LotteriData = {
    id: any;
    file: string;
    mfile: string;
    lotteri: string;
    prize: string;
    tickets: number;
    price: number;
    winner: string | null | undefined;
    date: string;
    sold: number;
    date_results: string;
    stream: string | null | undefined;
    amount: number;
    is_active: boolean;
    progress: number
};

export type TicketsDetails = {
    id: number;
    uuid: string;
    ticket: string;
    date: string;
    voucher: string;
    giveaway: number;
    email: any;
    giveawayID: string;
    is_active: boolean;
};

export type SessionInfo = {session: Session | null | undefined;};
export type ModalFunction = {closeModal: () => void;};
export type ForgotPasswordConfirmProps = {updateForgotPasswordModalState: (value: boolean) => void;};
export type SessionModal = SessionInfo & ModalFunction;
export type ForgotPasswordConfirmModal = ForgotPasswordConfirmProps & ModalFunction;
