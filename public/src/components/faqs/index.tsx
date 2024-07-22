import React from 'react';
import { useSession } from 'next-auth/react';

import FAQs from '@/components/faqs/components/page';

export default function Page() {
  return (
    <section>
      <FAQs />
    </section>
  );
}
