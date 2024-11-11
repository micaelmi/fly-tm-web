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
import { useEffect, useState } from "react";

export default function FeaturesCarousel() {
  const session = useSession().data;
  const username = session?.payload.username;
  const token = session?.token.user.token;

  const [user, setUser] = useState<User>();

  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get(`/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

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
            imageUrl={
              user?.club.logo_url ||
              `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.club.id}`
            }
            text="Meu clube"
            linkToFeaturePage={`/clubs/${user?.club.id}`}
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
