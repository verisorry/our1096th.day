import MessageCalendar from "@/components/MessageCalendar";
import messagesData from '@/data/messages.json';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <MessageCalendar data={messagesData} />
      </main>
    </div>
  );
}
