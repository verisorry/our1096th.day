// It takes your data and creates a grid of colored squares
// Each square represents one day

interface DayData {
//   id: number;
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
//   isApart: boolean;
}

interface MessageGridProps {
  data: DayData[];
}

export default function MessageCalendar({ data }: MessageGridProps) {
    return (
        <div className="relative w-full overflow-x-auto pb-4">
            <div className="grid gap-1 w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                {data.map((day, index) => {
                    return (
                        <div
                            key={day.date}
                            className="w-5 h-5 rounded cursor-pointer transition-transform hover:scale-110 hover:z-10 bg-gray-500"
                            >

                        </div>
                    )
                })}
            </div>
        </div>
    )



}