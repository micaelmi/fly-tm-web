"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useTrainingsDataByUser } from "@/hooks/use-trainings";
import Loading from "@/app/loading";
import Link from "next/link";
import { Training, TrainingsResponse } from "@/interfaces/training";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { Strategy, StrategyResponse } from "@/interfaces/strategy";
import StrategyCard from "./strategy-card";

interface StrategyCarouselProps {
  strategies: UseQueryResult<AxiosResponse<StrategyResponse, any>, Error>;
  noStrategiesMessage: ReactNode;
}

export default function StrategyCarousel({
  strategies,
  noStrategiesMessage,
}: StrategyCarouselProps) {
  const { isLoading, error, data } = strategies;

  let strategiesData: Strategy[] = [];
  if (data?.data.strategies) strategiesData = data.data.strategies;

  if (isLoading) return <Loading />;
  if (error) return <p>Erro ao carregar estratégias: {error.message}</p>;

  if (strategiesData.length < 1) {
    return (
      <p className="w-full font-medium text-center text-lg text-muted-foreground">
        {noStrategiesMessage}
      </p>
    );
  }

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
        {strategiesData
          ? strategiesData.map((strategy: Strategy) => {
              return (
                <CarouselItem
                  key={strategy.id}
                  className="md:basis-1/2 lg:basis-1/3 py-2"
                >
                  <StrategyCard
                    by={strategy.user.username}
                    level={strategy.level.title}
                    title={strategy.title}
                    urlToStrategy={`/strategies/${strategy.id}`}
                  />
                </CarouselItem>
              );
            })
          : null}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
