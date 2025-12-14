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
    // if no message
    if (day.messageCount === 0) {
        return {
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
        };
    }

    const compound = day.sentiment.compound;
    let rgb;

    // if very negative
    if (compound < -0.3) rgb = '81, 38, 1';

    // if negative
    else if (compound < -0.05) rgb = '145, 70, 3';

    // if neutral
    else if (compound <= 0.05) rgb = '15, 94, 156';

    // if positive
    else if (compound <= 0.3) rgb = '56, 106, 0';

    // if very positive
    else rgb = '99, 180, 0';

    // opacity based on message count
    const opacity = 0.4 + (day.messageCount / maxMessages) * 0.6;

    return { backgroundColor: `rgba(${rgb}, ${opacity})` };
}

const getFlower = (index: number) => {
    // const flowers = ['❋','❀', '✿', '❁', '❃', '᪥', '𖠇', '❊', '✺', '🪷', '🌸', '🌷', '🌻', '🌼', '🪻', '🍂']
    const flowers = ['🪷', '🌸', '🌷', '🌻', '🌼', '🪻', '🍂']

    return flowers[index % flowers.length]
}

export default function MessageCalendar({ data }: MessageGridProps) {
    const maxMessages = useMemo(() => 
        Math.max(...data.map(d => d.messageCount)),
        [data]
    );

    return (
        <div className="relative w-full pb-4">
            <div className="grid w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                {data.map((day, index) => {
                    const style = getCellStyle(day, maxMessages);

                    return (
                        <div
                            key={day.date}
                            className={`
                                w-8 h-8
                                cursor-pointer 
                                transition-transform 
                                hover:scale-110
                                hover:z-10
                                text-center
                                align-middle
                                leading-8
                                `}
                            style={style}
                            >

                                {/* grow a flower if a milestone */}
                                {
                                (day.milestone)
                                    ? <span className="text-2xl"> {getFlower(index)} </span>
                                    : null
                                }

                        </div>
                    )
                })}
            </div>
        </div>
    )
}