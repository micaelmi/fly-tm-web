import {
  CalendarCheck,
  MapPinLine,
  Medal,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
      <Button className="text-sm self-end">Ver mais</Button>
    </div>
  );
}
