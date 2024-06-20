
import { Session } from 'next-auth';

export type ImagenSlider = {
    settings: any;
    file: string;
};

export type InfoType = {
    nit: string;
    email: string;
    phone: string;
    facebook: string;
    twitter: string;
    instagram: string;
};

export interface Tour {
    id: string;
    type: string;
    name: string;
    banner: string;
    location: string;
    date: string;
    description: string;
    price: number;
    is_active: boolean;
};
  
export type ToursType = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tour[];
};

export type SessionInfo = {session: Session | null | undefined;};
export type ModalFunction = {closeModal: () => void;};
export type ForgotPasswordConfirmProps = {updateForgotPasswordModalState: (value: boolean) => void;};
export type SessionModal = SessionInfo & ModalFunction;
export type ForgotPasswordConfirmModal = ForgotPasswordConfirmProps & ModalFunction;
