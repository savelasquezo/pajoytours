import React from 'react';
import { useSession } from 'next-auth/react';

import Footer from '@/components/footer/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Footer session={session} />
    </section>
  );
}
