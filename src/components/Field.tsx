'use client';

import { useEffect, useRef } from 'react';
import MessageCalendar, { DayData } from "@/components/MessageCalendar";

const backgrounds = [
  { path: '/DarkDirt_Fall.png', color: '#C16024'},
  { path: '/DarkDirt_Spring.png', color: '#B67A29'},
  { path: '/DarkDirt_Winter.png', color: '#9EEEFF'},
  { path: '/DarkDirt_Summer.png', color: '#C47E17'},
]

export interface FieldStats {
  totalMessages: number;
  daysTogether: number;
  daysApart: number;
  avgMessagesPerDay: number;
  apartAvg: number;
  togetherAvg: number;
  sentimentBreakdown: {
    very_positive: number;
    very_negative: number;
  };
}

interface FieldProps {
  data: DayData[];
  stats: FieldStats;
  names: { you: string; him: string };
  dateRange: string;
  footer: React.ReactNode;
  /** optional notice shown above the title (used by demo mode) */
  banner?: React.ReactNode;
  /** when set, flowers are picked deterministically instead of at random */
  flowerSeed?: number;
}

export default function Field({ data, stats, names, dateRange, footer, banner, flowerSeed }: FieldProps) {
  const asideRef = useRef<HTMLElement>(null);

  // the season is rolled on the client and painted straight onto the element:
  // that way the server and the first client render agree, and it still
  // changes on every refresh
  useEffect(() => {
    const season = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const aside = asideRef.current;
    if (!aside) return;
    aside.style.backgroundImage = `url(${season.path})`;
    aside.style.backgroundColor = season.color;
  }, []);

  return (
    <main className="flex flex-col md:flex-row md:h-screen pb-12 md:pb-0 p-2 bg-zinc-50 font-mono text-zinc-800">
      <section className="flex flex-col gap-4 justify-start py-10 px-8 lg:px-12 lg:pt-12 xl:py-16 flex-1 uppercase ">
        <div className="flex flex-col h-full max-w-120 gap-y-12 md:gap-y-0 justify-between self-center">
          {/* title */}
          <div className='flex flex-col gap-y-4'>
            {banner}
            <div>
              <h1 className="text-4xl mb-2 md:mb-0 md:text-3xl">Our 1096th Day</h1>
              <p className="text-xs text-zinc-400">{dateRange}</p>
              <p className='text-xs text-zinc-400'>(Refresh, it changes!)</p>
            </div>
            {/* explanation */}
            <div className="text-sm">
              <h3>Three years of conversations.</h3>
              <h3>Every square is a day, every flower is a milestone, every colour is how we felt.</h3>
            </div>
          </div>

          <div className="flex flex-col gap-y-12 md:gap-y-8">
            {/* legend */}
            <div className="flex flex-col gap-y-2">
              <p className="text-sm">1. How to read this field</p>
              <div className="normal-case py-4 px-6 leading-5 text-sm bg-zinc-100 text-zinc-800 border border-zinc-200">
                <p>🟤 Brown = negative sentiment or 0 messages</p>
                <p className="mt-1">🟢 Green = positive sentiment</p>
                <p className="mt-1">🔆 Brighter = more messages</p>
                <p className="mt-4">🌸 Flowers = milestones (hover to see which one)</p>
                <p className="mt-4">Hover to see top quotes, emojis, and details from each day.</p>
              </div>
              <p className='normal-case text-xs text-zinc-400'>disclaimer: Sentiment colors are generated using automated text analysis and may not perfectly reflect every moment.</p>
            </div>

            {/* stats */}
            <div className="flex flex-col gap-y-2">
              <p className="text-sm">2. Some fun stats</p>
              <div className="flex flex-col gap-y-4 text-sm normal-case">
                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.totalMessages.toLocaleString()}</span> messages</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.daysTogether}</span> days together</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.daysApart}</span> days apart</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.avgMessagesPerDay}</span> messages / day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.apartAvg}</span> messages / apart day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.togetherAvg}</span> messages / together day</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.sentimentBreakdown.very_positive}</span> very positive msgs :)</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{stats.sentimentBreakdown.very_negative}</span> very negative msgs &gt;:(</p>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="text-sm text-zinc-400">
            {footer}
          </div>

        </div>
      </section>

      {/* grid: fills whatever space it is given, no scrolling */}
      <aside
        ref={asideRef}
        className="flex flex-1 h-[80vh] md:h-auto items-center justify-center rounded-lg p-2 md:rounded-none"
        style={{
          backgroundImage: `url(${backgrounds[0].path})`,
          backgroundColor: backgrounds[0].color
      }}
      >
        <MessageCalendar data={data} names={names} flowerSeed={flowerSeed} />
      </aside>
    </main>
  );
}
