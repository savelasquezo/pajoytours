import React, { useState } from "react";
import { useSession } from 'next-auth/react';

import WalletModal from '@/components/wallet/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <WalletModal session={session} />
    </section>
  );
}
