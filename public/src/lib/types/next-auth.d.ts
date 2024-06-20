import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      phone: string;
      location: string | undefined;
      balance: number;
      frame: string | undefined;
      accessToken: string;
      refreshToken: string;
    };
  }
}
