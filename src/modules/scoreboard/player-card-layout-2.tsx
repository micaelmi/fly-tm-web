import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface PlayerCardLayout2Props {
  player: number;
  name: string;
  games: number;
  points: number;
  service: boolean;
  changePoint: (operator: string, player: number) => void;
}
export default function PlayerCardLayout2({
  player,
  name,
  games,
  points,
  service,
  changePoint,
}: PlayerCardLayout2Props) {
  const color = player === 1 ? "#2024db" : "#ad0d0d";
  return (
    <div
      className={`bg-slate-900 flex gap-4 items-center justify-between p-1 rounded-md select-none`}
      onClick={() => changePoint("+", player)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`size-20 rounded-md ml-4`}
          style={{ backgroundColor: color }}
        />
        <h3 className="font-bold text-5xl">{name}</h3>
      </div>
      <div className="flex items-center gap-1">
        {service && (
          <img
            src="/service.svg"
            alt="Patola sacando"
            className="mr-2 size-20"
          />
        )}
        <p className="flex justify-center items-center bg-background p-2 rounded-md size-32 font-bold text-7xl">
          {games}
        </p>
        <p
          className={`flex justify-center items-center p-2 rounded-md size-32 font-bold text-7xl ${points === 10 && "text-red-600"}`}
        >
          {points}
        </p>
      </div>
    </div>
  );
}
