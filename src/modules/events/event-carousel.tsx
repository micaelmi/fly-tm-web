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

export default function EventsCarousel() {
  const { data, isLoading, error } = useEventsData();

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

  return (
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
        {data?.events.map((event) => {
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
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
