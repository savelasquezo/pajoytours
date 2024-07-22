import React from 'react';
import { useSession } from 'next-auth/react';

import Schedule from '@/components/schedule/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Schedule session={session} />
    </section>
  );
}
