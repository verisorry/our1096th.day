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
    const MOBILE_COLUMNS = 28;
    const DESKTOP_COULMNS = 52;

    const DAYS = data.length;

    return (
        <div className="relative w-full overflow-x-auto pb-4">
            {/* desktop */}
            <div className="hidden md:grid grid-cols-52 gap-1 w-fit mx-auto">
                {data.map((day) => {
                    return (
                        <div 
                            key={day.id}
                            className="w-3 h-3 rounded cursor-pointer transition-transform hover:scale-110 hover:z-10 bg-gray-500"
                            >

                        </div>
                    )
                })}
            </div>

        </div>
    )



}