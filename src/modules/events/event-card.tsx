import { Event } from "@/interfaces/event";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  MapPinLine,
  Medal,
} from "@phosphor-icons/react/dist/ssr";
import EventDetails from "./event-details";

interface EventCardProps {
  data: Event;
  title: string;
  date: string;
  local: string;
  level: string;
  className?: string;
  adminView?: boolean;
}

export default function EventCard({
  data,
  date,
  level,
  local,
  title,
  className,
  adminView = false,
}: EventCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col mx-2 p-3 border rounded-xl shadow-blue-500 shadow-md",
        className
      )}
    >
      <h3 className="font-semibold truncate">{title}</h3>
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarCheck size={20} />
        {date}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPinLine size={20} />
        {local}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Medal size={20} />
        Nível: {level}
      </div>
      <EventDetails data={data} adminView={adminView} />
    </div>
  );
}
