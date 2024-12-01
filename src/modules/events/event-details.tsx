import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Event } from "@/interfaces/event";
import {
  CalendarCheck,
  Coins,
  Flag,
  MapPinLine,
  Medal,
  Pencil,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import Link from "next/link";
import { DeleteEvent } from "./delete-event";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hexToRgba } from "@/lib/utils";
import { DeleteTrainingOrStrategy } from "../trainings/delete-training-or-strategy";
import { useDeleteEvent } from "@/hooks/use-events";

interface EventDetailsProps {
  data: Event;
  adminView?: boolean;
}

export default function EventDetails({
  data,
  adminView = false,
}: EventDetailsProps) {
  const hasColor = data.image_url && data.image_url.startsWith("#");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm self-end">Ver mais</Button>
      </DialogTrigger>
      <DialogContent
        className={`${hasColor ? "w-[600px]" : "w-[800px]"} max-w-none`}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between mt-5">
              <div className="flex items-center gap-2">
                {hasColor && (
                  <div
                    className="rounded w-5 aspect-square"
                    style={{ backgroundColor: data.image_url }}
                  />
                )}
                {data.name}
              </div>
              <div className="flex gap-2">
                {adminView && (
                  <>
                    <Link
                      href={`/events/${data.id}/update`}
                      className="border-muted hover:border-muted-foreground p-2 border rounded-full text-muted hover:text-muted-foreground transition-all hover:cursor-pointer"
                    >
                      <Pencil />
                    </Link>
                    <DeleteTrainingOrStrategy
                      type="home"
                      id={data.id}
                      useFunction={useDeleteEvent}
                    />
                  </>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-5">
          <div className="flex flex-col gap-4">
            {data.image_url && data.image_url.startsWith("http") && (
              <img
                src={data.image_url}
                alt={data.name}
                className="rounded w-52 h-full object-cover"
              />
            )}
          </div>
          <div className="flex gap-5">
            <ScrollArea
              className={`p-2 pr-6 rounded-lg h-64 text-justify break-words break-all ${!hasColor ? "bg-modal w-60" : "w-1/2"}`}
              {...(hasColor
                ? {
                    style: {
                      backgroundColor: hexToRgba(data.image_url ?? "", 0.25),
                    },
                  }
                : {})}
            >
              {data.description}
            </ScrollArea>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Flag size={20} />
                  Nível:
                </div>
                {data.level.title}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <CalendarCheck size={20} />
                  Data
                </div>
                <p className="whitespace-nowrap">
                  {format(data.start_date, "dd/MM/yyyy")}
                  {data.start_date !== data.end_date &&
                    " - " + format(data.end_date, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="flex gap-2 font-semibold text-primary">
                  <MapPinLine size={20} /> Endereço
                </p>
                <p className="whitespace-nowrap">
                  {data.street}, {data.neighborhood}, {data.address_number}
                </p>
                <p className="whitespace-nowrap">
                  {data.state} - {data.city} | CEP: {data.cep}
                </p>
                <p className="whitespace-nowrap">
                  {data.complement && "Complemento: " + data.complement}
                </p>
                {data.maps_url && (
                  <Link
                    className="font-bold underline"
                    target="_blank"
                    href={data.maps_url}
                  >
                    Link Maps
                  </Link>
                )}
              </div>

              {data.price && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Coins size={20} />
                    Valor:
                  </div>
                  {data.price}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
