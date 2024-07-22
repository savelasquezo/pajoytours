import React from 'react';
import { useSession } from 'next-auth/react';

import Terms from '@/components/terms/components/page';

export default function Page() {
  return (
    <section>
      <Terms />
    </section>
  );
}
