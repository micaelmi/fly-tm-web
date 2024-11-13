import { Separator } from "../../components/ui/separator";

interface TrainingsSessionProps {
  sessionTitle: string;
}

export default function TrainingsSession({
  sessionTitle,
}: TrainingsSessionProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-semibold text-lg whitespace-nowrap">
        {sessionTitle}
      </h2>
      <Separator className="shrink" />
    </div>
  );
}
