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
  MapPinLine,
  Medal,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import Link from "next/link";
import { DeleteEvent } from "./delete-event";

interface EventDetailsProps {
  data: Event;
  adminView?: boolean;
}

export default function EventDetails({
  data,
  adminView = false,
}: EventDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm self-end">Ver mais</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {data.image_url && data.image_url.startsWith("#") && (
            <div
              className="rounded w-10/12 h-10"
              style={{ backgroundColor: data.image_url }}
            ></div>
          )}
          <DialogTitle className="font-semibold text-2xl text-primary">
            {data.name}
          </DialogTitle>
          <DialogDescription className="text-base text-white">
            {data.description}
          </DialogDescription>
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CalendarCheck size={20} />
                {format(data.start_date, "dd/MM/yyyy")}
                {data.start_date !== data.end_date &&
                  " - " + format(data.end_date, "dd/MM/yyyy")}
              </div>
              <div className="flex flex-col">
                <p className="flex gap-2 font-semibold text-primary">
                  <MapPinLine size={20} /> Endereço
                </p>
                <p>
                  {data.street}, {data.neighborhood}, {data.address_number}
                </p>
                <p>
                  {data.state} - {data.city} | CEP: {data.cep}
                </p>
                <p>{data.complement && "Complemento: " + data.complement}</p>
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
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Medal size={20} />
                Nível: {data.level.title}
              </div>

              {data.price && (
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Coins size={20} />
                  Valor: {data.price}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {data.image_url && data.image_url.startsWith("http") && (
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="rounded w-32 h-32 aspect-square object-cover"
                />
              )}
              {adminView && (
                <div className="flex flex-col justify-end gap-2 h-full">
                  <Link
                    href={`/events/${data.id}/update`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    Editar
                  </Link>
                  <DeleteEvent eventId={data.id} />
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
