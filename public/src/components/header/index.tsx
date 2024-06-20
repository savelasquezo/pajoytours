import React from 'react';
import { useSession } from 'next-auth/react';

import Header from '@/components/header/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Header session={session} />
    </section>
  );
}
