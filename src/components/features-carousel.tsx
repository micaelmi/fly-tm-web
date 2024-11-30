"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import FeatureCard from "./cards/feature-card";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { User } from "@/interfaces/user";
import api from "@/lib/axios";

interface UserData {
  user: User;
}

export default function FeaturesCarousel() {
  const session = useSession().data;
  const username = session?.payload.username;
  const token = session?.token.user.token;

  const userData = useQuery({
    queryKey: ["userData", username],
    queryFn: async (): Promise<AxiosResponse<UserData>> => {
      return await api.get(`/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
    select: (data) => {
      return {
        club_id: data.data.user.club.id,
        club_logo_url: data.data.user.club.logo_url,
      };
    },
  });

  const user = userData.data;
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
            linkToFeaturePage="strategies"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Patola atacando"
            imageUrl="mascot-hitting.svg"
            text="Meu perfil"
            linkToFeaturePage={`/users/${username}`}
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Logo de clube"
            imageUrl={user?.club_logo_url ?? `mascot-default.svg`}
            text={user?.club_id ? "Meu clube" : "Clubes"}
            linkToFeaturePage={
              user?.club_id ? `/clubs/${user?.club_id}` : "#clubs"
            }
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/3 lg:basis-1/5">
          <FeatureCard
            alt="Placar"
            imageUrl="mascot-scoreboard.svg"
            text="Placar"
            linkToFeaturePage="/scoreboard"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
