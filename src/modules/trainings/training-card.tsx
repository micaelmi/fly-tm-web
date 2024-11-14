import api from "@/lib/axios";
import { Flag, Clock } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface TrainingCardProps {
  urlToTraining: string;
  level: string;
  title: string;
  duration: number;
  by: string;
}

export default function TrainingCard({
  urlToTraining,
  level,
  title,
  duration,
  by,
}: TrainingCardProps) {
  return (
    <Link
      href={urlToTraining}
      className="inline-block hover:opacity-80 transition-all"
    >
      <div className="flex flex-col gap-5 border-primary p-4 border rounded-xl w-min min-w-72">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm">
            <Flag />
            {level}
          </div>
          {title}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Clock />
            {duration}
          </div>
          <p className="text-primary text-sm">Por: {by}</p>
        </div>
      </div>
    </Link>
  );
}
