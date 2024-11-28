import { Separator } from "../../components/ui/separator";

interface PageSessionProps {
  sessionTitle: string;
}

export default function PageSession({ sessionTitle }: PageSessionProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-semibold text-lg whitespace-nowrap">
        {sessionTitle}
      </h2>
      <Separator className="shrink" />
    </div>
  );
}
