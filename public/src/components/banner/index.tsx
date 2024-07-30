import React from 'react';
import { useSession } from 'next-auth/react';

import Banner from '@/components/banner/components/page';

export default function Page() {
  return (
    <section>
      <Banner />
    </section>
  );
}
