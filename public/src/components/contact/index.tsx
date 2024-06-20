import React from 'react';
import { useSession } from 'next-auth/react';

import Contact from '@/components/contact/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Contact session={session} />
    </section>
  );
}


