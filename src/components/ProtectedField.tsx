'use client';

import dynamic from 'next/dynamic';
import PasswordProtect from '@/components/PasswordProtect';

// lazy, so the real messages are only fetched once the password is in -
// nothing personal ends up in the bundle a demo visitor downloads
const RealField = dynamic(() => import('@/components/RealField'), { ssr: false });

export default function ProtectedField() {
  return (
    <PasswordProtect>
      <RealField />
    </PasswordProtect>
  );
}
