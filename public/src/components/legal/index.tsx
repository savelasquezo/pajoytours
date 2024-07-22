import React from 'react';
import { useSession } from 'next-auth/react';

import Legal from '@/components/legal/components/page';

export default function Page() {
  return (
    <section>
      <Legal />
    </section>
  );
}
