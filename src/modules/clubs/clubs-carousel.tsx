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

export default function ClubsCarousel() {
  // const { data, isLoading, error } = useClubsData();

  // if (isLoading) return <p>Carregando clubes...</p>;
  // if (error) return <p>Erro ao carregar clubes: {error.message}</p>;

  return (
    <Carousel
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
        {/* {data?.clubs.map((club) => {
          return (
            <CarouselItem
              key={club.id}
              className="md:basis-1/2 lg:basis-1/3 py-2"
            >
              <ClubCard
                buttonContent={}
                imageUrl={}
                local={}
                members={}
                name={}
              />
            </CarouselItem>
          );
        })} */}

        <CarouselItem className="md:basis-1/2 lg:basis-1/3 py-2">
          <ClubCard
            buttonContent="Conhecer"
            imageUrl="club-logo.svg"
            local="Piracaia - SP"
            members={30}
            name="Centro de Treinamento"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 py-2">
          <ClubCard
            buttonContent="Conhecer"
            imageUrl="club-logo.svg"
            local="Piracaia - SP"
            members={30}
            name="Centro de Treinamento"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 py-2">
          <ClubCard
            buttonContent="Conhecer"
            imageUrl="club-logo.svg"
            local="Piracaia - SP"
            members={30}
            name="Centro de Treinamento"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 py-2">
          <ClubCard
            buttonContent="Conhecer"
            imageUrl="club-logo.svg"
            local="Piracaia - SP"
            members={30}
            name="Centro de Treinamento F. Oliveira"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 py-2">
          <ClubCard
            buttonContent="Conhecer"
            imageUrl="club-logo.svg"
            local="Piracaia - SP"
            members={30}
            name="Centro de Treinamento F. Oliveira"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
