import api from "@/lib/axios";
import { formatTime } from "@/lib/utils";
import { Flag, Clock } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface StrategyCardProps {
  urlToStrategy: string;
  level: string;
  title: string;
  by: string;
}

export default function StrategyCard({
  urlToStrategy,
  level,
  title,
  by,
}: StrategyCardProps) {
  return (
    <Link
      href={urlToStrategy}
      className="inline-block hover:opacity-80 transition-all"
    >
      <div className="flex flex-col gap-5 border-primary p-4 border rounded-xl w-min min-w-72 max-w-72">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm">
            <Flag />
            {level}
          </div>
          <h1 className="truncate">{title}</h1>
        </div>
        <p className="text-primary text-sm">Por: {by}</p>
      </div>
    </Link>
  );
}
