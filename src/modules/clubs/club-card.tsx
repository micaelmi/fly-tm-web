import { UsersThree } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClubCardProps {
  clubId: string;
  name: string;
  imageUrl: string;
  members: number;
  local: string;
}

export default function ClubCard({
  clubId,
  name,
  imageUrl,
  local,
  members,
}: ClubCardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-2 shadow-blue-500 shadow-md mx-2 p-3 border rounded-xl">
      <h4 className="font-semibold text-center">{name}</h4>
      <img
        src={imageUrl}
        alt="Logo do clube"
        height={115}
        width={115}
        className="border-secondary border rounded-full aspect-square"
      />
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <UsersThree size={20} />
        {members}
      </div>
      <p className="text-muted-foreground text-sm">{local}</p>
      <Link
        href={`/clubs/${clubId}`}
        className={cn(buttonVariants({ variant: "default" }), "w-full text-sm")}
      >
        Conhecer
      </Link>
    </div>
  );
}
