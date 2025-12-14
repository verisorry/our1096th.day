'use client';

import { useState } from 'react';
import MessageCalendar from "@/components/MessageCalendar";
import messagesData from '@/data/messages.json';
import statsData from '@/data/stats.json'

const backgrounds = [
  { path: '/DarkDirt_Fall.png', color: '#C16024'},
  { path: '/DarkDirt_Spring.png', color: '#B67A29'},
  { path: '/DarkDirt_Winter.png', color: '#9EEEFF'},
  { path: '/DarkDirt_Summer.png', color: '#C47E17'},
]
export default function Home() {
  const [backgroundObject] = useState(() => {
    return backgrounds[Math.floor(Math.random() * 4)];
  });

  return (
    <main className="flex flex-col md:flex-row md:h-screen pb-12 md:pb-0 p-2 bg-zinc-50 font-mono text-zinc-800 dark:bg-black">
      <section className="flex flex-col gap-4 justify-start py-10 px-8 lg:px-12 lg:pt-12 xl:py-16 flex-1 uppercase ">
        <div className="flex flex-col h-full max-w-120 gap-y-12 md:gap-y-0 justify-between self-center">
          {/* title */}
          <div className='flex flex-col gap-y-4'>
            <div>
              <h1 className="text-4xl mb-2 md:mb-0 md:text-3xl">Our 1096th Day</h1>
              <p className="text-xs text-zinc-400">01/06/2023 - 01/06/2026</p>
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
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.totalMessages.toLocaleString()}</span> messages</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.daysTogether}</span> days together</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.daysApart}</span> days apart</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.avgMessagesPerDay}</span> messages / day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.apartAvg}</span> messages / apart day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.togetherAvg}</span> messages / together day</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.sentimentBreakdown.very_positive}</span> very positive msgs :)</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> <span className='font-medium'>{statsData.sentimentBreakdown.very_negative}</span> very negative msgs &gt;:(</p>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="text-sm text-zinc-400">
            <p>
              I love you!
            </p>
            <p>
              Made for Luke for our 3rd anniversary &lt;3
            </p>
          </div>

        </div>
      </section>

      {/* grid */}
      <aside
        className="flex flex-1 items-center justify-center rounded-lg p-2 md:rounded-none"
        style={{ 
          backgroundImage: `url(${backgroundObject.path})`,
          backgroundColor: backgroundObject.color
       }}
      >
        <MessageCalendar data={messagesData} />
      </aside>
    </main>
  );
}
