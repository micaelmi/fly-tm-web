"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import FeatureCard from "./cards/feature-card";
import { useSession } from "next-auth/react";

export default function FeaturesCarousel() {
  const username = useSession().data?.payload.username;
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className="py-8">
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Patola sacando"
            imageUrl="mascot-serve.svg"
            text="Treinos"
            linkToFeaturePage="trainings"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Patola criando estratégia"
            imageUrl="mascot-strategy.svg"
            text="Estratégias"
            linkToFeaturePage="#"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Patola atacando"
            imageUrl="mascot-hitting.svg"
            text="Meu perfil"
            linkToFeaturePage={`/user/${username}`}
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Logo de clube"
            imageUrl="club-logo.svg"
            text="Clubes"
            linkToFeaturePage="#"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Placar"
            imageUrl="scoreboard.svg"
            text="Placar"
            linkToFeaturePage="#"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
