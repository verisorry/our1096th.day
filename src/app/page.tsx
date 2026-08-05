import Field from '@/components/Field';
import ProtectedField from '@/components/ProtectedField';
import { demoDays, demoStats, DEMO_NAMES } from '@/demo/demoData';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { demo } = await searchParams;

  // /?demo=true shows the same field built from generated data, no password
  if (demo === 'true') {
    return (
      <Field
        data={demoDays}
        stats={demoStats}
        names={DEMO_NAMES}
        dateRange="01/01/2020 - 12/31/2022"
        flowerSeed={1096}
        banner={
          <p className="normal-case text-xs leading-5 py-1.5 px-3 bg-amber-100 text-amber-900 border border-amber-300">
            <span className="font-medium">Demo mode.</span> Every day, quote, milestone
            and stat here is randomly generated.
          </p>
        }
        footer={
          <>
            <p>A demo of a private gift.</p>
            <p>The real one lives behind a password &lt;3</p>
          </>
        }
      />
    );
  }

  return <ProtectedField />;
}
