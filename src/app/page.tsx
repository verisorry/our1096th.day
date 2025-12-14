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
    <main className="flex flex-col md:flex-row h-screen p-2 bg-zinc-50 font-mono text-zinc-800 dark:bg-black">
      <section className="flex flex-col gap-4 justify-start p-4 lg:px-12 lg:py-12 xl:px-16 flex-1 uppercase ">
        <div className="flex h-full max-w-120 flex-col justify-between self-center">
          {/* what do i need here? */}
          {/* title */}
          <div>
            <h1 className="text-3xl">Our 1096th Day</h1>
            <p className="text-xs text-zinc-400">01/06/2023 - 01/06/2026</p>
          </div>

          <div className="flex flex-col gap-y-8">
            {/* explanation */}
            <div className="text-sm">
              <h3>Three years of conversations.</h3>
              <h3>Every square is a day, every flower is a milestone, every colour is how we felt.</h3>
            </div>
            {/* legend */}
            <div className="flex flex-col gap-y-4">
              <p className="text-sm">1. How to read this field</p>
              <div className="normal-case py-4 px-6 leading-5 text-sm bg-zinc-100 text-zinc-800 border border-zinc-200">
                <p>🟤 Brown = negative sentiment or 0 messages</p>
                <p className="mt-1">🟢 Green = positive sentiment</p>
                <p className="mt-1">🔆 Brighter = more messages</p>
                <p className="mt-4">🌸 Flowers = milestones (hover to see which one)</p>
                <p className="mt-4">Hover to see top quotes, emojis, and details from each day.</p>
              </div>
            </div>

            {/* stats */}
            <div className="flex flex-col gap-y-4">
              <p className="text-sm">2. Some fun stats</p>
              <div className="flex flex-col gap-y-4 text-sm">
                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.totalMessages.toLocaleString()} Messages</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.daysTogether} Days Together</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.daysApart} Days Apart</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.avgMessagesPerDay} Messages/Day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.apartAvg} Apart Messages/Day</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.togetherAvg} Together Messages/Day</p>
                </div>

                <div className="flex flex-col gap-y-1">
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.sentimentBreakdown.very_positive} Very Positive Msg</p>
                  <p className="relative -mx-1 w-fit bg-neutral-200 px-1"> {statsData.sentimentBreakdown.very_negative} Very Negative Msg</p>
                </div>
              </div>
            </div>
          </div>
          {/* footer */}
          <div className="flex flex-col items-start gap-y-1 text-sm uppercase text-neutral-400">
            <p>
              Made for Luke for our 3rd anniversary &lt;3
            </p>
          </div>
        </div>
      </section>

      {/* grid */}
      <aside
        className="flex flex-1 items-center justify-center "
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
