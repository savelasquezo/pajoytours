import React from "react";
import { useSession } from 'next-auth/react';

import Lotteries from '@/components/lotteries/components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <Lotteries session={session} />
    </section>
  );
}
