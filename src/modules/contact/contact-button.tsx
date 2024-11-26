"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatTeardropDots } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ContactButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="right-8 bottom-8 fixed w-16 h-16">
          <Link
            href={"/contacts/register"}
            className="right-8 bottom-8 fixed bg-primary p-2 rounded-full aspect-square"
          >
            <ChatTeardropDots size={48} color="black" />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="opacity-80 mt-4 mr-2">
          <p className="font-semibold text-base">Entrar em contato</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
