"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ClubCard from "./club-card";
import { useClubsData } from "@/hooks/use-clubs";

export default function ClubsCarousel() {
  const { data, isLoading, error } = useClubsData();

  if (isLoading)
    return (
      <p className="w-full text-center animate-pulse">Carregando clubes...</p>
    );
  if (error) return <p>Erro ao carregar clubes: {error.message}</p>;
  if (data && data.clubs.length < 1)
    return (
      <p className="w-full font-medium text-center text-lg text-primary">
        Nenhum clube cadastrado, seja o primeiro a criar seu clube aqui!
      </p>
    );

  return (
    <Carousel
      id="clubs"
      className="px-4 w-full"
      opts={{
        loop: true,
        align: "center",
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {data?.clubs.map((club) => {
          return (
            <CarouselItem
              key={club.id}
              className="md:basis-1/2 lg:basis-1/3 py-2"
            >
              <ClubCard
                clubId={club.id}
                name={club.name}
                imageUrl={club.logo_url}
                members={club._count.users}
                local={club.city + " - " + club.state}
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
