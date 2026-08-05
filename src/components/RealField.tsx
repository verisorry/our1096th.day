'use client';

// The real thing. This module is the only place the exported message data is
// imported, and it is loaded lazily (see ProtectedField) so the demo never
// pulls it down.

import Field from '@/components/Field';
import messagesData from '@/data/messages.json';
import statsData from '@/data/stats.json';

export default function RealField() {
  return (
    <Field
      data={messagesData}
      stats={statsData}
      names={{
        you: process.env.NEXT_PUBLIC_YOUR_NAME ?? 'Me',
        him: process.env.NEXT_PUBLIC_HIS_NAME ?? 'You',
      }}
      dateRange="01/06/2023 - 01/06/2026"
      footer={
        <>
          <p>I love you!</p>
          <p>Made for Luke for our 3rd anniversary &lt;3</p>
        </>
      }
    />
  );
}
