import React from 'react';
import { useSession } from 'next-auth/react';

import Navbar from '@/components/navbar/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Navbar session={session} />
    </section>
  );
}
