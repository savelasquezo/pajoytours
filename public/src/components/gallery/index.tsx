import React from 'react';
import { useSession } from 'next-auth/react';

import Gallery from '@/components/gallery/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Gallery session={session} />
    </section>
  );
}
