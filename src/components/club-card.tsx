import {
  CalendarCheck,
  MapPinLine,
  Medal,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ClubCardProps {
  name: string;
  imageUrl: string;
  members: number;
  local: string;
  buttonContent: string;
}

export default function ClubCard({
  buttonContent,
  imageUrl,
  local,
  members,
  name,
}: ClubCardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-2 p-3 border rounded min-w-48">
      <h4 className="font-semibold text-center">{name}</h4>
      <Image
        src={imageUrl}
        alt="Logo do clube"
        height={115}
        width={115}
        className="aspect-square"
      />
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <UsersThree size={20} />
        {members}
      </div>
      <p className="text-muted-foreground text-sm">{local}</p>
      <Button className="w-full text-xs">{buttonContent}</Button>
    </div>
  );
}
