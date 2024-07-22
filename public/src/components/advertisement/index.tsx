import React from 'react';
import { useSession } from 'next-auth/react';

import Advertisement from '@/components/advertisement/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Advertisement session={session} />
    </section>
  );
}
