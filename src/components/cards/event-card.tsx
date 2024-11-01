import {
  CalendarCheck,
  MapPinLine,
  Medal,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  date: string;
  local: string;
  level: string;
  className?: string;
}

export default function EventCard({
  date,
  level,
  local,
  title,
  className,
}: EventCardProps) {
  return (
    <div className={cn("flex flex-col p-3 border rounded min-w-72", className)}>
      <h3 className="font-semibold">{title}</h3>
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
      <Button className="text-xs self-end">Ver mais</Button>
    </div>
  );
}
