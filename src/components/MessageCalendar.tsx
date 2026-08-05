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
  names: { you: string; him: string };
  /** when set, flowers are picked deterministically instead of at random */
  flowerSeed?: number;
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

// seeded alternative, used by demo mode so the server and client agree
function seededRandom(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
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

// don't let a small dataset blow the squares up to dinner plates
const MAX_CELL = 34;
const MIN_CELL = 2;
// the fence svg is 480x512
const FENCE_ASPECT = 480 / 512;

// pick the column count and square size that fits every day in the space we
// have - so the whole field is visible without scrolling, whatever the size
// of the data or the window
function fitField(count: number, width: number, height: number) {
    const fenceHeight = Math.round(Math.min(48, Math.max(14, height * 0.06)));
    const fenceGap = Math.round(fenceHeight / 6);
    const gridHeight = height - 2 * (fenceHeight + fenceGap);

    if (count === 0 || width <= 0 || gridHeight <= 0) return null;

    let bestCols = 1;
    let bestSize = 0;
    for (let cols = 1; cols <= count; cols++) {
        const rows = Math.ceil(count / cols);
        const size = Math.min(width / cols, gridHeight / rows);
        if (size > bestSize) {
            bestSize = size;
            bestCols = cols;
        }
    }

    const size = Math.floor(Math.min(bestSize, MAX_CELL));
    if (size < MIN_CELL) return null;

    return { cols: bestCols, size, fenceHeight, fenceGap };
}

export default function MessageCalendar({ data, names, flowerSeed }: MessageGridProps) {
    const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});
    const [clickedDay, setClickedDay] = useState<DayData | null>(null);
    const [box, setBox] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLDivElement>(null);

    const maxMessages = useMemo(() =>
        Math.max(...data.map(d => d.messageCount)),
        [data]
    );

    // keep track of the space we have to fill
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setBox({ width, height });
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const layout = useMemo(
        () => fitField(data.length, box.width, box.height),
        [data.length, box.width, box.height]
    );

    // close hover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
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
        const random = flowerSeed === undefined ? null : seededRandom(flowerSeed);
        data.forEach(day => {
            if (day.milestone) {
                map.set(
                    day.date,
                    random
                        ? FLOWERS[Math.floor(random() * FLOWERS.length)]
                        : getFlower()
                );
            }
        });
        return map;
    }, [data, flowerSeed]);

    const fenceWidth = layout ? layout.cols * layout.size : 0;
    const fencePosts = layout
        ? Math.ceil(fenceWidth / (layout.fenceHeight * FENCE_ASPECT)) + 1
        : 0;

    const fence = layout ? (
        <div
            className="flex overflow-hidden justify-center"
            style={{ height: layout.fenceHeight, width: fenceWidth }}
        >
            {Array.from({ length: fencePosts }).map((_, i) => (
                <FenceIcon
                    key={i}
                    color="#E7B682"
                    className="h-full w-auto shrink-0 -mx-px"
                />
            ))}
        </div>
    ) : null;

    return (
        <div
            className="relative flex h-full w-full items-center justify-center"
            ref={containerRef}
        >
            {layout && (
                <div
                    ref={fieldRef}
                    className="w-fit"
                >
                    {/* Top fence */}
                    <div style={{ marginBottom: layout.fenceGap }}>{fence}</div>

                    {/* grid */}
                    <div
                        className="grid w-fit h-fit mx-auto"
                        style={{ gridTemplateColumns: `repeat(${layout.cols}, ${layout.size}px)` }}
                    >
                        {data.map((day) => {
                            const style = getCellStyle(day, maxMessages);
                            const flowerObject = flowerMap.get(day.date);

                            return (
                                <div
                                    key={day.date}
                                    className={`
                                        cursor-pointer
                                        transition-transform
                                        hover:scale-110
                                        hover:z-10
                                        flex items-center justify-center
                                        overflow-visible
                                        `}
                                    style={{ ...style, width: layout.size, height: layout.size }}
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
                                            style={{
                                                color: (`rgb(${flowerObject.color})`),
                                                fontSize: layout.size * 2.2,
                                                lineHeight: 1,
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

                    {/* Bottom fence */}
                    <div style={{ marginTop: layout.fenceGap }}>{fence}</div>
                </div>
            )}

            {(hoveredDay || clickedDay) && (
                <HoverCard
                    day={hoveredDay || clickedDay!}
                    names={names}
                    position={mousePosition}
                    onClose={() => setClickedDay(null)}
                />
            )}
        </div>
    );
}
