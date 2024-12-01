"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "./event-card";
import { useEventsData } from "@/hooks/use-events";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";

export default function EventsCarousel() {
  const user_id = useSession().data?.payload.sub;
  const { data, isLoading, error } = useEventsData();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading)
    return (
      <p className="w-full text-center animate-pulse">Carregando eventos...</p>
    );
  if (error) return <p>Erro ao carregar eventos: {error.message}</p>;
  if (data && data.events.length < 1)
    return (
      <p className="w-full font-medium text-center text-lg text-primary">
        Nenhum evento cadastrado, seja o primeiro a publicar seu evento aqui!
      </p>
    );

  const filteredEvents = data?.events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl whitespace-nowrap">
          Confira os próximos eventos
        </h3>
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={35} />
          <Input
            type="search"
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-60"
          />
        </div>
      </div>
      {filteredEvents && filteredEvents.length < 1 ? (
        <p className="w-full font-medium text-center text-lg text-primary">
          Nenhum evento encontrado para "{searchTerm}".
        </p>
      ) : (
        <Carousel
          className="px-4 w-full"
          opts={{
            loop: true,
            align: "center",
          }}
          plugins={[
            Autoplay({
              delay: 4500,
            }),
          ]}
        >
          <CarouselContent>
            {filteredEvents &&
              filteredEvents.map((event) => {
                return (
                  <CarouselItem
                    key={event.id}
                    className="md:basis-1/2 lg:basis-1/3 py-2"
                  >
                    <EventCard
                      data={event}
                      date={format(event.start_date, "dd/MM/yyyy")}
                      level={event.level.title}
                      title={event.name}
                      local={event.city + " - " + event.state}
                      adminView={event.user_id === user_id ? true : false}
                    />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </>
  );
}
