import { DayData } from "./MessageCalendar";
import { useMemo } from "react";

export default function HoverCard({ day, position }: { day: DayData; position: { x: number; y: number } }) {
  const estimatedWidth = 256;
  const estimatedHeight = 300;

  const adjustedPosition = useMemo(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x + 20;
    let y = position.y + 20;

    // flip to left if would overflow
    if (x + estimatedWidth > viewportWidth) {
      x = position.x - estimatedWidth - 20;
    }

    // flip to top if would overflow
    if (y + estimatedHeight > viewportHeight) {
      y = position.y - estimatedHeight - 20;
    }

    // Check left boundary
    if (x < 0) {
      x = 10;
    }

    // Check top boundary
    if (y < 0) {
      y = 10;
    }

    return { x, y };
  }, [position.x, position.y]);

  return (
    <div
      className="fixed flex flex-col z-50 bg-gray-100 text-gray-800 p-4 rounded-lg shadow-2xl border border-gray-300 w-64 pointer-events-none"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
        <div className="text-sm font-semibold text-gray-800 mb-2">
            {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}
            <div className="text-sm">{day.era}</div>
        </div>
        
        {day.milestone && (
            <div className="mb-2 text-yellow-500 font-medium text-sm">
            ✨ {day.milestone} ✨
            </div>
        )}
        {day.isApart && (
            <div className="text-red-500 mb-2 font-medium text-sm">📍 Apart</div>
        )}

        <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
                <span>Messages:</span>
                <span className="font-medium">{day.messageCount}</span>
            </div>
            
            <div className="flex justify-between gap-4">
                <span>From {process.env.NEXT_PUBLIC_YOUR_NAME}:</span>
                <span className="font-medium">{day.fromYou}</span>
            </div>
            
            <div className="flex justify-between gap-4">
                <span>From {process.env.NEXT_PUBLIC_HIS_NAME}:</span>
                <span className="font-medium">{day.fromHim}</span>
            </div>
        </div>
        
        {day.quote && (
            <div className="mt-3 pt-3 border-t border-gray-700">
                <span className="text-sm mb-1">Quote of the Day:</span>
                <span className="text-xs italic text-gray-600 line-clamp-3">
                    &ldquo;{day.quote}&rdquo;
                </span>
            </div>
        )}
        
        {day.topEmoji && (
            <div className="pt-2 flex items-center">
                <span className="text-sm">Emoji of the Day: {day.topEmoji}</span>
            </div>
        )}
    </div>
  );
}
