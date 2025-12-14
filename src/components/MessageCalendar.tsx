// It takes your data and creates a grid of colored squares
// Each square represents one day

import { useMemo } from "react";

interface DayData {
  date: string;
  messageCount: number;
  fromMe: number;
  fromHim: number;
  sentiment: {
    compound: number;
    label: string;
  };
  quote: string;
  topEmoji: string;
  era: string;
  milestone: string | null;
}

interface MessageGridProps {
  data: DayData[];
}

// helper for colour logic
const getCellStyle = (day: DayData, maxMessages: number) => {
    // if no message, soil
    if (day.messageCount === 0) {
        return {
            backgroundColor: 'rgba(58, 45, 35, 0.8)',
        };
    }

    const compound = day.sentiment.compound;
    let rgb;

    // if very negative
    if (compound < -0.3) rgb = '61, 40, 23';

    // if negative
    else if (compound < -0.05) rgb = '101, 67, 33';

    // if neutral
    else if (compound <= 0.05) rgb = '120, 140, 160';

    // if positive
    else if (compound <= 0.3) rgb = '106, 168, 79';

    // if very positive
    else rgb = '64, 143, 77';

    // opacity based on message count
    const opacity = 0.45 + (day.messageCount / maxMessages) * 0.55;

    return { backgroundColor: `rgba(${rgb}, ${opacity})` };
}

function getRandomInt(max: number) {
        return Math.floor(Math.random() * max)
}

const FLOWERS = [
  { symbol: '✿', color: '247, 205, 205' }, // pink
  { symbol: '❃', color: '247, 205, 205' }, // pink
  { symbol: '❀', color: '255, 217, 102' }, // yellow
  { symbol: '❁', color: '255, 217, 102' }, // yellow
  { symbol: '❋', color: '255, 255, 255' }, // white
  { symbol: '✾', color: '255, 255, 255' }, // white
  { symbol: '✽', color: '63, 77, 184' }, // blue
  { symbol: '❇', color: '63, 77, 184' }, // blue
];

const getFlower = () => {
    return FLOWERS[getRandomInt(FLOWERS.length)]
}

export default function MessageCalendar({ data }: MessageGridProps) {
    const maxMessages = useMemo(() => 
        Math.max(...data.map(d => d.messageCount)),
        [data]
    );

    return (
        <div className="relative w-full pb-4">
            <div className="grid w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                {data.map((day) => {
                    const style = getCellStyle(day, maxMessages);
                    const flowerObject = getFlower();

                    return (
                        <div
                            key={day.date}
                            className={`
                                w-8 h-8
                                cursor-pointer
                                transition-transform
                                hover:scale-110
                                hover:z-10
                                flex items-center justify-center
                                overflow-visible
                                `}
                            style={style}
                            >

                                {/* grow a flower if a milestone */}
                                {
                                (day.milestone)
                                    ? <div 
                                    className="text-6xl"
                                    style={{ 
                                        color: (`rgb(${flowerObject.color})`), 
                                        textShadow: `
                                            0 0 3px rgba(${flowerObject.color}, 0.35),
                                            0 0 6px rgba(255,255,255,0.25)
                                            `,
                                        zIndex: 999
                                    }}> 
                                        {flowerObject.symbol} 
                                    </div>
                                    : null
                                }

                        </div>
                    )
                })}
            </div>
        </div>
    )
}