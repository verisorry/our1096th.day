// It takes your data and creates a grid of colored squares
// Each square represents one day
"use client"

import { useMemo, useState, useEffect, useRef } from "react";
import HoverCard from "./HoverCard";
import FenceIcon from "./FenceIcon"
export interface DayData {
  date: string;
  messageCount: number;
  fromYou: number;
  fromHim: number;
  sentiment: {
    compound: number;
    label: string;
  };
  quote: string;
  topEmoji: string;
  era: string;
  milestone: string | null;
  isApart: boolean;
}

interface MessageGridProps {
  data: DayData[];
}

// helper for colour logic
const getCellStyle = (day: DayData, maxMessages: number) => {
    // if no message, soil
    if (day.messageCount === 0) {
        return {
            backgroundImage: `linear-gradient(rgba(58, 45, 35, 0.8), rgba(58, 45, 35, 0.8)), linear-gradient(white, white)`,
            backgroundPosition: '0 0, 0 0',
            backgroundSize: '100% 100%, 100% 100%',
            backgroundRepeat: 'no-repeat'
        };
    }

    const compound = day.sentiment.compound;
    let rgb;

    // if very negative
    if (compound < -0.3) rgb = '205, 120, 45';

    // if negative
    else if (compound < -0.05) rgb = '173, 116, 36';

    // if neutral = lake
    else if (compound <= 0.05) rgb = '0, 192, 192';

    // if positive
    else if (compound <= 0.3) rgb = '104, 113, 35';

    // if very positive
    else rgb = '38, 90, 41';

    // opacity based on message count
    const opacity = 0.65 + (day.messageCount / maxMessages) * 0.35;

    return {
        backgroundImage: `linear-gradient(rgba(${rgb}, ${opacity}), rgba(${rgb}, ${opacity})), linear-gradient(white, white)`,
        backgroundPosition: '0 0, 0 0',
        backgroundSize: '100% 100%, 100% 100%',
        backgroundRepeat: 'no-repeat'
    };
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
  { symbol: '✼', color: '63, 77, 184' }, // blue
];

const getFlower = () => {
    return FLOWERS[getRandomInt(FLOWERS.length)]
}

export default function MessageCalendar({ data }: MessageGridProps) {
    const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});
    const [clickedDay, setClickedDay] = useState<DayData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const maxMessages = useMemo(() =>
        Math.max(...data.map(d => d.messageCount)),
        [data]
    );

    // close hover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setClickedDay(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // memoize flower selection so it only changes on load
    const flowerMap = useMemo(() => {
        const map = new Map<string, typeof FLOWERS[0]>();
        data.forEach(day => {
            if (day.milestone) {
                map.set(day.date, getFlower());
            }
        });
        return map;
    }, [data]);

    return (
        <div className="relative" ref={containerRef}>
            <div className="w-fit mx-auto">
                {/* Top fence */}
                <div className="hidden md:flex w-full h-12 mb-2 overflow-hidden">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <FenceIcon 
                            key={i}
                            color="#E7B682" 
                            className="h-full w-auto shrink-0 -mx-px"
                        />
                    ))}
                </div>

                <div className="flex md:hidden w-full h-12 mb-4 overflow-hidden justify-center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <FenceIcon 
                            key={i}
                            color="#E7B682" 
                            className="h-full w-auto shrink-0 -mx-px"
                        />
                    ))}
                </div>

                {/* grid */}
                <div className="grid w-fit h-fit mx-auto grid-cols-16 md:grid-cols-14">
                    {data.map((day) => {
                        const style = getCellStyle(day, maxMessages);
                        const flowerObject = flowerMap.get(day.date);

                        return (
                            <div
                                key={day.date}
                                className={`
                                    w-5 h-5
                                    md:w-7 md:h-7
                                    cursor-pointer
                                    transition-transform
                                    hover:scale-110
                                    hover:z-10
                                    flex items-center justify-center
                                    overflow-visible
                                    `}
                                style={style}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                                onMouseLeave={() => setHoveredDay(null)}
                                onClick={(e) => {
                                    setClickedDay(clickedDay?.date === day.date ? null : day);
                                    setMousePosition({ x: e.clientX, y: e.clientY });
                                }}
                                >

                                    {/* grow a flower if a milestone */}
                                    {
                                    (day.milestone && flowerObject)
                                        ? <div
                                        className="text-3xl md:text-6xl"
                                        style={{
                                            color: (`rgb(${flowerObject.color})`),
                                            textShadow: `
                                                0 0 3px rgba(${flowerObject.color}, 0.35),
                                                0 0 6px rgba(255,255,255,0.25)
                                                `,
                                            zIndex: 9
                                        }}>
                                            {flowerObject.symbol}
                                        </div>
                                        : null
                                    }

                            </div>
                        )
                    })}
                </div>

                {(hoveredDay || clickedDay) && (
                    <HoverCard
                        day={hoveredDay || clickedDay!}
                        position={mousePosition}
                        onClose={() => setClickedDay(null)}
                    />
                )}

                {/* Bottom fence */}
                <div className="hidden md:flex w-full h-12 mt-2 overflow-hidden">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <FenceIcon 
                            key={i}
                            color="#E7B682" 
                            className="h-full w-auto shrink-0 -mx-px"
                        />
                    ))}
                </div>

                <div className="flex md:hidden w-full h-12 mt-4 overflow-hidden justify-center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <FenceIcon 
                            key={i}
                            color="#E7B682" 
                            className="h-full w-auto shrink-0 -mx-px"
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
